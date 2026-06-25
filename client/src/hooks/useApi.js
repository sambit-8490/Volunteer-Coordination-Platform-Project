import { useState, useCallback } from 'react';
import API, { getErrorMessage } from '../api.js';

/**
 * Custom hook for API calls with automatic state management
 * @returns {Object} API utilities
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Make an API request
   * @param {Function} apiCall - Async function that makes the API call
   * @param {Object} options - Options
   * @returns {Promise} API response data
   */
  const request = useCallback(async (apiCall, options = {}) => {
    const { onSuccess, onError, showError = true } = options;

    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      const data = response.data;

      if (onSuccess) {
        onSuccess(data);
      }

      return data;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      
      if (showError) {
        setError(errorMessage);
      }

      if (onError) {
        onError(err, errorMessage);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * GET request
   * @param {string} url - API endpoint
   * @param {Object} options - Options
   * @returns {Promise}
   */
  const get = useCallback((url, options = {}) => {
    return request(() => API.get(url), options);
  }, [request]);

  /**
   * POST request
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} options - Options
   * @returns {Promise}
   */
  const post = useCallback((url, data, options = {}) => {
    return request(() => API.post(url, data), options);
  }, [request]);

  /**
   * PUT request
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} options - Options
   * @returns {Promise}
   */
  const put = useCallback((url, data, options = {}) => {
    return request(() => API.put(url, data), options);
  }, [request]);

  /**
   * DELETE request
   * @param {string} url - API endpoint
   * @param {Object} options - Options
   * @returns {Promise}
   */
  const del = useCallback((url, options = {}) => {
    return request(() => API.delete(url), options);
  }, [request]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    delete: del,
    clearError
  };
};

export default useApi;
