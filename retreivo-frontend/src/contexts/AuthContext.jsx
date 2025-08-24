import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hub, setHub] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and user/hub data on app load
    const existingToken = localStorage.getItem('token');
    const existingUser = localStorage.getItem('user');
    const existingHub = localStorage.getItem('hub');
    
    if (existingToken) {
      try {
        setToken(existingToken);
        if (existingUser) {
          setUser(JSON.parse(existingUser));
        }
        if (existingHub) {
          setHub(JSON.parse(existingHub));
        }
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('hub');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setHub(null); // Clear any existing hub data
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.removeItem('hub'); // Remove hub data
  };

  const hubLogin = (hubData, hubToken) => {
    setHub(hubData);
    setUser(null); // Clear any existing user data
    setToken(hubToken);
    localStorage.setItem('token', hubToken);
    localStorage.setItem('hub', JSON.stringify(hubData));
    localStorage.removeItem('user'); // Remove user data
  };

  const logout = () => {
    setUser(null);
    setHub(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('hub');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const updateHub = (updatedHub) => {
    setHub(updatedHub);
    localStorage.setItem('hub', JSON.stringify(updatedHub));
  };

  const value = {
    user,
    hub,
    token,
    loading,
    login,
    hubLogin,
    logout,
    updateUser,
    updateHub,
    isAuthenticated: !!token,
    isUserAuthenticated: !!user,
    isHubAuthenticated: !!hub
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


