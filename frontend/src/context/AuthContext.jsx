import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light-mode');

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('admin_user');
    const token = localStorage.getItem('admin_token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('admin_user', JSON.stringify(userData));
    localStorage.setItem('admin_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light-mode' ? 'dark-mode' : 'light-mode');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
