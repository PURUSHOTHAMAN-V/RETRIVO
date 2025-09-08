// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to get auth headers
const getAuthHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token');
  return {
    ...(!isMultipart && { 'Content-Type': 'application/json' }),
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return data;
};

export async function getBackendHealth() {
  const r = await fetch(`${API_BASE_URL}/api/health`);
  return r.json();
}

export async function getMlHealth() {
  const r = await fetch(`${API_BASE_URL}/api/ml/health`);
  return r.json();
}

export async function matchText(query) {
  const r = await fetch(`${API_BASE_URL}/api/ml/match-text`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query })
  });
  return r.json();
}

// Auth endpoints
export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// Get current user profile
export const getProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      headers: getAuthHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// User endpoints
export const reportLostItem = async (itemData) => {
  try {
    // Check if the request contains images
    const hasImages = itemData.images && itemData.images.length > 0;
    
    const response = await fetch(`${API_BASE_URL}/api/user/report-lost`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(itemData)
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const reportFoundItem = async (itemData) => {
  try {
    // Check if the request contains images
    const hasImages = itemData.images && itemData.images.length > 0;
    
    const response = await fetch(`${API_BASE_URL}/api/user/report-found`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(itemData)
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getUserReports = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/reports`, {
      headers: getAuthHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const searchItems = async (searchData) => {
  try {
    // Check if the request contains images
    const hasImages = searchData.images && searchData.images.length > 0;
    
    const response = await fetch(`${API_BASE_URL}/api/user/search`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(searchData)
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const claimItem = async (claimData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/claim`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(claimData)
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// Hub endpoints
export const getHubClaims = async (status = 'pending') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/hub/claims?status=${status}`, {
      headers: getAuthHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const approveHubClaim = async (claimId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/hub/claim/${claimId}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getUserRewards = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/rewards`, {
      headers: getAuthHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// Chat endpoints
export const sendChatMessage = async (message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message })
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getChatHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/history`, {
      headers: getAuthHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};




