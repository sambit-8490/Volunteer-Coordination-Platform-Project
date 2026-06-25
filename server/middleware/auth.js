const { verifyToken } = require('./authMiddleware');
const { authorizeRoles } = require('./authorizationMiddleware');

module.exports = {
  verifyToken,
  authorize: authorizeRoles
};
