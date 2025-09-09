import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { Pool } = pkg;

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178'],
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('combined'));

// Basic rate limit
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 });
app.use(limiter);

// Database
const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:Vpcare@24x7@localhost:5432/retreivo';

// Health check endpoint that doesn't require database
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Backend service is running' });
});
const pool = new Pool({ connectionString: databaseUrl });
const jwtSecret = process.env.JWT_SECRET || 'dev_secret_change_me';

// JWT Middleware for protected routes
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ ok: false, error: 'Access token required' });
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, jwtSecret);
    
    // Add user info to request
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ ok: false, error: 'Token expired' });
    }
    return res.status(403).json({ ok: false, error: 'Invalid token' });
  }
};

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

app.get('/api/health', async (_req, res) => {
  try {
    const result = await pool.query('SELECT 1 as ok');
    res.json({ ok: true, db: result.rows[0].ok === 1, message: 'Backend service is running with database connection' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Auth endpoints
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body || {};
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Missing required fields: name, email, and password are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT user_id FROM users WHERE email = $1', [email]);
    if (existingUser.rowCount > 0) {
      return res.status(409).json({ ok: false, error: 'Email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert new user
    const result = await pool.query(
      'INSERT INTO users(name, email, phone, password_hash, role) VALUES($1, $2, $3, $4, $5) RETURNING user_id, name, email, role, created_at',
      [name, email, phone || null, hashedPassword, 'citizen']
    );
    
    const user = result.rows[0];
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        sub: user.user_id, 
        email: user.email, 
        role: user.role 
      }, 
      jwtSecret, 
      { expiresIn: '7d' }
    );
    
    console.log(`User created successfully: ${user.email}`);
    
    res.status(201).json({ 
      ok: true, 
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      }, 
      token 
    });
    
  } catch (err) {
    console.error('Signup error:', err);
    if (err.code === '23505') {
      return res.status(409).json({ ok: false, error: 'Email already exists' });
    }
    res.status(500).json({ ok: false, error: 'Internal server error during signup' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Email and password are required' 
      });
    }

    // Find user by email
    const result = await pool.query(
      'SELECT user_id, name, email, role, password_hash, created_at FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rowCount === 0) {
      return res.status(401).json({ ok: false, error: 'Invalid email or password' });
    }
    
    const user = result.rows[0];
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      console.log(`Failed login attempt for email: ${email}`);
      return res.status(401).json({ ok: false, error: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        sub: user.user_id, 
        email: user.email, 
        role: user.role 
      }, 
      jwtSecret, 
      { expiresIn: '7d' }
    );
    
    console.log(`User logged in successfully: ${user.email}`);
    
    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user;
    
    res.json({ 
      ok: true, 
      user: userWithoutPassword, 
      token 
    });
    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ ok: false, error: 'Internal server error during login' });
  }
});

// Get current user profile
app.get('/api/auth/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ ok: false, error: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, jwtSecret);
      const result = await pool.query(
        'SELECT user_id, name, email, phone, role, rewards_balance, created_at FROM users WHERE user_id = $1',
        [decoded.sub]
      );
      
      if (result.rowCount === 0) {
        return res.status(404).json({ ok: false, error: 'User not found' });
      }
      
      res.json({ ok: true, user: result.rows[0] });
    } catch (jwtError) {
      return res.status(401).json({ ok: false, error: 'Invalid or expired token' });
    }
    
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ ok: false, error: 'Internal server error' });
  }
});

// Update user profile
app.put('/api/auth/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ ok: false, error: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, jwtSecret);
      const { name, phone } = req.body || {};
      
      if (!name) {
        return res.status(400).json({ ok: false, error: 'Name is required' });
      }
      
      const result = await pool.query(
        'UPDATE users SET name = $1, phone = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3 RETURNING user_id, name, email, phone, role, rewards_balance, updated_at',
        [name, phone || null, decoded.sub]
      );
      
      if (result.rowCount === 0) {
        return res.status(404).json({ ok: false, error: 'User not found' });
      }
      
      res.json({ ok: true, user: result.rows[0] });
    } catch (jwtError) {
      return res.status(401).json({ ok: false, error: 'Invalid or expired token' });
    }
    
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ ok: false, error: 'Internal server error' });
  }
});

app.post('/api/auth/otp-verify', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
app.post('/api/auth/digilocker', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
app.post('/api/auth/refresh', (_req, res) => res.status(501).json({ message: 'Not implemented' }));

// User endpoints (protected)
app.post('/api/user/report-lost', authenticateToken, async (req, res) => {
  try {
    const { name, category, description, location, date_lost, images } = req.body || {};
    const userId = req.user.sub;
    
    if (!name || !description) {
      return res.status(400).json({ ok: false, error: 'Name and description are required' });
    }
    
    // Insert into database
    const result = await pool.query(
      'INSERT INTO lost_items(user_id, name, category, description, location, date_lost) VALUES($1, $2, $3, $4, $5, $6) RETURNING item_id, name, category, description, location, date_lost, status, created_at',
      [userId, name, category || null, description, location || null, date_lost || null]
    );
    
    const item = result.rows[0];
    
    // Store item in ML service for future matching
    try {
      const mlResponse = await fetch(`${process.env.ML_SERVICE_URL || 'http://localhost:8000'}/store-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: item.item_id,
          item_type: 'lost',
          item_name: name,
          category,
          description,
          location,
          date: date_lost,
          image: images && images.length > 0 ? images[0] : null
        })
      });
      
      const mlData = await mlResponse.json();
      if (!mlData.ok) {
        console.warn('ML service warning:', mlData);
      } else {
        console.log('Item stored in ML service:', mlData);
      }
    } catch (mlErr) {
      // Don't fail the request if ML service is down
      console.error('ML service error:', mlErr);
    }
    
    res.status(201).json({ 
      ok: true, 
      item,
      available_for_matching: true
    });
  } catch (err) {
    console.error('Report lost item error:', err);
    res.status(500).json({ ok: false, error: 'Failed to report lost item' });
  }
});

app.post('/api/user/report-found', authenticateToken, async (req, res) => {
  try {
    const { name, category, description, location, date_found, images } = req.body || {};
    const userId = req.user.sub;
    
    if (!name || !description) {
      return res.status(400).json({ ok: false, error: 'Name and description are required' });
    }
    
    // Insert into database
    const result = await pool.query(
      'INSERT INTO found_items(user_id, name, category, description, location, date_found) VALUES($1, $2, $3, $4, $5, $6) RETURNING item_id, name, category, description, location, date_found, status, created_at',
      [userId, name, category || null, description, location || null, date_found || null]
    );
    
    const item = result.rows[0];
    
    // Store item in ML service for future matching
    try {
      const mlResponse = await fetch(`${process.env.ML_SERVICE_URL || 'http://localhost:8000'}/store-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: item.item_id,
          item_type: 'found',
          item_name: name,
          category,
          description,
          location,
          date: date_found,
          image: images && images.length > 0 ? images[0] : null
        })
      });
      
      const mlData = await mlResponse.json();
      if (!mlData.ok) {
        console.warn('ML service warning:', mlData);
      } else {
        console.log('Item stored in ML service:', mlData);
      }
    } catch (mlErr) {
      // Don't fail the request if ML service is down
      console.error('ML service error:', mlErr);
    }
    
    res.status(201).json({ 
      ok: true, 
      item,
      available_for_matching: true
    });
  } catch (err) {
    console.error('Report found item error:', err);
    res.status(500).json({ ok: false, error: 'Failed to report found item' });
  }
});

app.get('/api/user/reports', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.sub;
    
    const [lostItems, foundItems] = await Promise.all([
      pool.query('SELECT * FROM lost_items WHERE user_id = $1 ORDER BY created_at DESC', [userId]),
      pool.query('SELECT * FROM found_items WHERE user_id = $1 ORDER BY created_at DESC', [userId])
    ]);
    
    res.json({ 
      ok: true, 
      lost_items: lostItems.rows,
      found_items: foundItems.rows
    });
  } catch (err) {
    console.error('Get reports error:', err);
    res.status(500).json({ ok: false, error: 'Failed to fetch reports' });
  }
});

app.post('/api/user/search', authenticateToken, async (req, res) => {
  try {
    const { query, category, location, item_name, description, date, images } = req.body || {};
    const userId = req.user.sub;
    
    // If we have images or detailed metadata, use ML service for advanced matching
    if (images && images.length > 0) {
      try {
        // Call ML service for image matching
        const mlResponse = await fetch(`${process.env.ML_SERVICE_URL || 'http://localhost:8000'}/match-item`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            item_type: 'lost',  // We're searching for a lost item
            item_name: item_name || query,
            category,
            description,
            location,
            date,
            image: images[0]
          })
        });
        
        const mlData = await mlResponse.json();
        if (!mlData.ok) {
          console.warn('ML service warning:', mlData);
          // Fall back to database search
        } else {
          // Process ML results
          const mlResults = mlData.results || [];
          
          // Fetch full item details from database for the matched items
          if (mlResults.length > 0) {
            const itemIds = mlResults.map(r => r.item_id);
            const dbResults = await pool.query(`
              SELECT 'found' as type, item_id, name, category, description, location, date_found as date, status, created_at
              FROM found_items 
              WHERE item_id = ANY($1) AND status = 'available'
            `, [itemIds]);
            
            // Combine ML scores with database results
            const enhancedResults = dbResults.rows.map(dbItem => {
              const mlItem = mlResults.find(r => r.item_id === dbItem.item_id);
              return {
                ...dbItem,
                match_score: mlItem ? mlItem.match_score : 0,
                image_similarity: mlItem ? mlItem.image_similarity : 0,
                metadata_similarity: mlItem ? mlItem.metadata_similarity : 0,
                next_step: mlItem ? mlItem.next_step : 'reject'
              };
            });
            
            return res.json({ 
              ok: true, 
              results: enhancedResults,
              match_found: enhancedResults.length > 0,
              best_match_score: enhancedResults.length > 0 ? enhancedResults[0].match_score : 0,
              search_method: 'ml_service'
            });
          }
        }
      } catch (mlErr) {
        console.error('ML service error:', mlErr);
        // Fall back to database search
      }
    }
    
    // Traditional database search as fallback
    if (!query && !category && !location) {
      return res.status(400).json({ ok: false, error: 'Search query, category, or location is required' });
    }
    
    // Search in both lost and found items
    const searchQuery = `
      SELECT 'lost' as type, item_id, name, category, description, location, date_lost as date, status, created_at
      FROM lost_items 
      WHERE (name ILIKE $1 OR description ILIKE $1 OR $1 IS NULL) 
        AND ($2::text IS NULL OR category = $2)
        AND ($3::text IS NULL OR location ILIKE $3)
        AND status = 'active'
      UNION ALL
      SELECT 'found' as type, item_id, name, category, description, location, date_found as date, status, created_at
      FROM found_items 
      WHERE (name ILIKE $1 OR description ILIKE $1 OR $1 IS NULL) 
        AND ($2::text IS NULL OR category = $2)
        AND ($3::text IS NULL OR location ILIKE $3)
        AND status = 'available'
      ORDER BY created_at DESC
      LIMIT 20
    `;
    
    const result = await pool.query(searchQuery, [
      query ? `%${query}%` : null, 
      category || null, 
      location ? `%${location}%` : null
    ]);
    
    res.json({ 
      ok: true, 
      results: result.rows,
      search_method: 'database'
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ ok: false, error: 'Search failed' });
  }
});

app.post('/api/user/claim', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const { item_id, item_type } = req.body || {};
    const userId = req.user.sub;
    
    if (!item_id || !item_type) {
      return res.status(400).json({ ok: false, error: 'Item ID and type are required' });
    }
    
    if (!['lost', 'found'].includes(item_type)) {
      return res.status(400).json({ ok: false, error: 'Invalid item type' });
    }
    
    await client.query('BEGIN');
    
    // First, check if the item is available for claiming
    let itemStatus;
    if (item_type === 'found') {
      const itemResult = await client.query('SELECT status FROM found_items WHERE item_id = $1', [item_id]);
      if (itemResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ ok: false, error: 'Item not found' });
      }
      itemStatus = itemResult.rows[0].status;
      
      if (itemStatus !== 'available') {
        await client.query('ROLLBACK');
        return res.status(400).json({ ok: false, error: 'Item is not available for claiming' });
      }
      
      // Update the item status to 'pending_claim'
      await client.query("UPDATE found_items SET status = 'pending_claim' WHERE item_id = $1", [item_id]);
    } else if (item_type === 'lost') {
      const itemResult = await client.query('SELECT status FROM lost_items WHERE item_id = $1', [item_id]);
      if (itemResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ ok: false, error: 'Item not found' });
      }
      itemStatus = itemResult.rows[0].status;
      
      if (itemStatus !== 'active') {
        await client.query('ROLLBACK');
        return res.status(400).json({ ok: false, error: 'Item is not available for claiming' });
      }
      
      // Update the item status to 'pending_claim'
      await client.query("UPDATE lost_items SET status = 'pending_claim' WHERE item_id = $1", [item_id]);
    }
    
    // Create the claim
    const result = await client.query(
      'INSERT INTO claims(user_id, item_id, item_type, status) VALUES($1, $2, $3, $4) RETURNING claim_id, user_id, item_id, item_type, status, created_at',
      [userId, item_id, item_type, 'pending']
    );
    
    await client.query('COMMIT');
    res.status(201).json({ ok: true, claim: result.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Claim error:', err);
    res.status(500).json({ ok: false, error: 'Failed to create claim' });
  } finally {
    client.release();
  }
});

app.get('/api/user/rewards', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.sub;
    
    const [userRewards, rewardHistory] = await Promise.all([
      pool.query('SELECT rewards_balance FROM users WHERE user_id = $1', [userId]),
      pool.query('SELECT * FROM rewards WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10', [userId])
    ]);
    
    res.json({ 
      ok: true, 
      balance: userRewards.rows[0]?.rewards_balance || 0,
      history: rewardHistory.rows
    });
  } catch (err) {
    console.error('Get rewards error:', err);
    res.status(500).json({ ok: false, error: 'Failed to fetch rewards' });
  }
});

// Hub endpoints (stubs)
// List claims for hub action (demo: no hub auth for now)
app.get('/api/hub/claims', async (req, res) => {
  try {
    const status = req.query.status || 'pending';

    const foundClaims = await pool.query(`
      SELECT c.claim_id, c.user_id AS claimer_user_id, c.item_id, c.item_type, c.status, c.created_at,
             f.name AS item_name, f.description AS item_description, f.location AS item_location,
             f.user_id AS finder_user_id
      FROM claims c
      JOIN found_items f ON c.item_id = f.item_id
      WHERE c.item_type = 'found' AND c.status = $1
      ORDER BY c.created_at DESC
    `, [status]);

    const lostClaims = await pool.query(`
      SELECT c.claim_id, c.user_id AS claimer_user_id, c.item_id, c.item_type, c.status, c.created_at,
             l.name AS item_name, l.description AS item_description, l.location AS item_location,
             NULL::INTEGER AS finder_user_id
      FROM claims c
      JOIN lost_items l ON c.item_id = l.item_id
      WHERE c.item_type = 'lost' AND c.status = $1
      ORDER BY c.created_at DESC
    `, [status]);

    res.json({ ok: true, claims: [...foundClaims.rows, ...lostClaims.rows] });
  } catch (err) {
    console.error('List claims error:', err);
    res.status(500).json({ ok: false, error: 'Failed to list claims' });
  }
});

// Approve claim and reward finder (demo flow)
app.put('/api/hub/claim/:id/approve', async (req, res) => {
  const client = await pool.connect();
  try {
    const claimId = Number(req.params.id);
    await client.query('BEGIN');

    const claimRes = await client.query('SELECT * FROM claims WHERE claim_id = $1 FOR UPDATE', [claimId]);
    if (claimRes.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ ok: false, error: 'Claim not found' });
    }
    const claim = claimRes.rows[0];
    if (claim.status !== 'pending') {
      await client.query('ROLLBACK');
      return res.status(400).json({ ok: false, error: 'Claim is not pending' });
    }

    // Update claim status
    await client.query('UPDATE claims SET status = $1 WHERE claim_id = $2', ['approved', claimId]);

    // If this is a found item claim, mark item claimed and reward finder
    if (claim.item_type === 'found') {
      const foundItemRes = await client.query('SELECT user_id FROM found_items WHERE item_id = $1 FOR UPDATE', [claim.item_id]);
      const finderUserId = foundItemRes.rows[0]?.user_id;
      await client.query("UPDATE found_items SET status = 'claimed' WHERE item_id = $1", [claim.item_id]);
      if (finderUserId) {
        const rewardAmount = 100; // demo reward
        await client.query('UPDATE users SET rewards_balance = rewards_balance + $1 WHERE user_id = $2', [rewardAmount, finderUserId]);
        await client.query('INSERT INTO rewards(user_id, amount, reason) VALUES($1, $2, $3)', [finderUserId, rewardAmount, 'Claim approved']);
      }
    } else if (claim.item_type === 'lost') {
      // For lost item claim approval, mark lost item resolved (optional)
      await client.query("UPDATE lost_items SET status = 'found' WHERE item_id = $1", [claim.item_id]);
    }

    await client.query('COMMIT');
    res.json({ ok: true, claim_id: claimId, status: 'approved' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Approve claim error:', err);
    res.status(500).json({ ok: false, error: 'Failed to approve claim' });
  } finally {
    client.release();
  }
});

app.get('/api/hub/reports', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
app.get('/api/hub/donations', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
app.get('/api/hub/fraud-alerts', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
app.get('/api/hub/analytics', (_req, res) => res.status(501).json({ message: 'Not implemented' }));

// Chatbot endpoints
app.post('/api/chat/message', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body || {};
    const userId = req.user.sub;
    
    if (!message) {
      return res.status(400).json({ ok: false, error: 'Message is required' });
    }
    
    // Store user message
    await pool.query(
      'INSERT INTO chat_messages(user_id, content, is_bot) VALUES($1, $2, $3)',
      [userId, message, false]
    );
    
    // Generate bot response based on user message
    let botResponse = '';
    
    if (message.toLowerCase().includes('lost') || message.toLowerCase().includes('missing')) {
      botResponse = 'To report a lost item, please go to the "Report Lost Item" section and provide details about your item.';
    } else if (message.toLowerCase().includes('found')) {
      botResponse = 'Thank you for finding an item! Please go to the "Report Found Item" section to help return it to its owner.';
    } else if (message.toLowerCase().includes('reward') || message.toLowerCase().includes('points')) {
      botResponse = 'You can earn rewards by helping return lost items to their owners. Check your rewards balance in the "Rewards" section.';
    } else if (message.toLowerCase().includes('claim')) {
      botResponse = 'If you see your lost item in the search results, you can claim it by clicking the "Claim" button on the item.';
    } else if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
      botResponse = 'Hello! How can I help you with Retreivo today?';
    } else {
      botResponse = 'I\'m here to help with lost and found items. You can ask me about reporting lost items, found items, rewards, or claims.';
    }
    
    // Store bot response
    const result = await pool.query(
      'INSERT INTO chat_messages(user_id, content, is_bot) VALUES($1, $2, $3) RETURNING message_id, content, is_bot, created_at',
      [userId, botResponse, true]
    );
    
    res.status(201).json({ ok: true, message: result.rows[0] });
  } catch (err) {
    console.error('Chat message error:', err);
    res.status(500).json({ ok: false, error: 'Failed to process chat message' });
  }
});

app.get('/api/chat/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.sub;
    const limit = parseInt(req.query.limit) || 50;
    
    const result = await pool.query(
      'SELECT message_id, content, is_bot, created_at FROM chat_messages WHERE user_id = $1 ORDER BY created_at ASC LIMIT $2',
      [userId, limit]
    );
    
    res.json({ ok: true, messages: result.rows });
  } catch (err) {
    console.error('Chat history error:', err);
    res.status(500).json({ ok: false, error: 'Failed to fetch chat history' });
  }
});

// ML endpoints proxy (stubs)
const mlServiceBaseUrl = process.env.ML_BASE_URL || 'http://localhost:8000';

app.get('/api/ml/health', async (_req, res) => {
  try {
    const r = await fetch(`${mlServiceBaseUrl}/health`);
    const data = await r.json();
    res.json(data);
  } catch (error) {
    res.status(502).json({ ok: false, error: error.message });
  }
});

app.post('/api/ml/match-image', async (req, res) => {
  try {
    const r = await fetch(`${mlServiceBaseUrl}/match-image`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req.body || {}),
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (error) {
    res.status(502).json({ ok: false, error: error.message });
  }
});

app.post('/api/ml/match-text', async (req, res) => {
  try {
    const r = await fetch(`${mlServiceBaseUrl}/match-text`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req.body || {}),
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (error) {
    res.status(502).json({ message: 'Not implemented' });
  }
});

app.post('/api/ml/detect-duplicate', async (req, res) => {
  try {
    const r = await fetch(`${mlServiceBaseUrl}/detect-fraud`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req.body || {}),
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (error) {
    res.status(502).json({ ok: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
  console.log(`Database URL: ${databaseUrl}`);
  console.log(`JWT Secret: ${jwtSecret.substring(0, 10)}...`);
});


