const errorHandler = (err, req, res, next) => {
  // Set default error response
  let error = { ...err };
  error.message = err.message;

  // Log to console for development
  console.error('ERROR:', {
    message: err.message,
    status: err.statusCode || 500,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = `${Object.keys(err.keyValue)[0]} already exists`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map(val => val.message)
      .join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  // Custom error with statusCode
  if (err.statusCode) {
    error.statusCode = err.statusCode;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

module.exports = errorHandler;
