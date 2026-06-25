import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Login user
   * @param {string} token - JWT token
   * @param {Object} userData - User data
   */
  const login = useCallback((token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  const isAuthenticated = useCallback(() => {
    return !!token && !!user;
  }, [token, user]);

  /**
   * Check if user has specific role
   * @param {string|string[]} roles - Role or array of roles
   * @returns {boolean}
   */
  const hasRole = useCallback((roles) => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  }, [user]);

  /**
   * Update user data
   * @param {Object} updates - User data updates
   */
  const updateUser = useCallback((updates) => {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, [user]);

  return {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    updateUser
  };
};

export default useAuth;
