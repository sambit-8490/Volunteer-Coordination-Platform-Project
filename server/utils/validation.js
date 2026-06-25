/**
 * Validation Utilities
 * Common validation functions
 */

const { VALIDATION } = require('../config/constants');

/**
 * Validate email format
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
const validatePassword = (password) => {
  if (!password) return { valid: false, error: 'Password is required' };
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return { 
      valid: false, 
      error: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters` 
    };
  }
  if (password.length > VALIDATION.PASSWORD_MAX_LENGTH) {
    return { 
      valid: false, 
      error: `Password must not exceed ${VALIDATION.PASSWORD_MAX_LENGTH} characters` 
    };
  }
  return { valid: true };
};

/**
 * Validate name
 */
const validateName = (name) => {
  if (!name) return { valid: false, error: 'Name is required' };
  if (name.length < VALIDATION.NAME_MIN_LENGTH) {
    return { 
      valid: false, 
      error: `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters` 
    };
  }
  if (name.length > VALIDATION.NAME_MAX_LENGTH) {
    return { 
      valid: false, 
      error: `Name must not exceed ${VALIDATION.NAME_MAX_LENGTH} characters` 
    };
  }
  return { valid: true };
};

/**
 * Validate donation amount
 */
const validateDonationAmount = (amount) => {
  const numAmount = Number(amount);
  if (isNaN(numAmount)) return { valid: false, error: 'Amount must be a number' };
  if (numAmount < VALIDATION.DONATION_MIN_AMOUNT) {
    return { 
      valid: false, 
      error: `Minimum donation amount is ₹${VALIDATION.DONATION_MIN_AMOUNT}` 
    };
  }
  if (numAmount > VALIDATION.DONATION_MAX_AMOUNT) {
    return { 
      valid: false, 
      error: `Maximum donation amount is ₹${VALIDATION.DONATION_MAX_AMOUNT}` 
    };
  }
  return { valid: true };
};

/**
 * Validate MongoDB ObjectId
 */
const validateObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validateDonationAmount,
  validateObjectId
};
