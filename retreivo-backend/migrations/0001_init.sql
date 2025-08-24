-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password_hash VARCHAR(255),
    role VARCHAR(20) DEFAULT 'citizen',
    digilocker_id VARCHAR(50),
    rewards_balance INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hubs table (referenced by found_items)
CREATE TABLE IF NOT EXISTS hubs (
    hub_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    location VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lost items table
CREATE TABLE IF NOT EXISTS lost_items (
    item_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    image_url VARCHAR(500),
    image_features JSONB,
    location VARCHAR(200),
    date_lost DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Found items table
CREATE TABLE IF NOT EXISTS found_items (
    item_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    hub_id INTEGER REFERENCES hubs(hub_id),
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    image_url VARCHAR(500),
    image_features JSONB,
    location VARCHAR(200),
    date_found DATE,
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Additional tables (skeletons)
CREATE TABLE IF NOT EXISTS claims (
    claim_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    item_id INTEGER,
    item_type VARCHAR(10) CHECK (item_type IN ('lost','found')),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rewards (
    reward_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    amount INTEGER NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donations (
    donation_id SERIAL PRIMARY KEY,
    hub_id INTEGER REFERENCES hubs(hub_id),
    item_id INTEGER,
    item_type VARCHAR(10) CHECK (item_type IN ('lost','found')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fraud_reports (
    fraud_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    score NUMERIC(4,3) NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);








