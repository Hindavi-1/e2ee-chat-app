/**
 * middleware/authMiddleware.js
 * ----------------------------
 * Express middleware that protects routes from unauthenticated access.
 * Middleware functions run BETWEEN a request arriving and the controller handling it.
 *
 * What this file does RIGHT NOW:
 *   - Exports a `protect` function that logs a note and calls next()
 *   - All requests pass through without any real authentication check
 *
 * What you will add LATER:
 *   1. Read the Authorization header: "Bearer <token>"
 *   2. Verify the JWT token using the secret key (from crypto/jwt.js)
 *   3. Decode the token payload to get the user's ID
 *   4. Attach the user object to req.user so controllers can access it
 *   5. If the token is missing or invalid, return 401 Unauthorized
 *
 * How middleware works:
 *   - Call next() to pass control to the next middleware or controller
 *   - Call res.status(401).json({...}) to reject the request early
 */

/**
 * protect()
 * Middleware function to guard routes that require authentication.
 *
 * Usage in a route file:
 *   const { protect } = require('../middleware/authMiddleware');
 *   router.get('/messages', protect, chatController.getMessages);
 */



// const protect = (req, res, next) => {
//   // TODO: Extract token from Authorization header
//   // const authHeader = req.headers.authorization;
//   // if (!authHeader || !authHeader.startsWith('Bearer ')) {
//   //   return res.status(401).json({ error: 'No token provided' });
//   // }
//   // const token = authHeader.split(' ')[1];

//   // TODO: Verify the JWT token
//   // const decoded = jwtHelper.verifyToken(token);  // from crypto/jwt.js
//   // req.user = { id: decoded.userId };              // attach user to request

//   console.log("[authMiddleware] protect() called — no real check yet (placeholder)");

//   // For now, just pass through to the next handler
//   next();
// };

// module.exports = { protect };



const { verifyToken } = require('../crypto/jwt');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  // 1. Get token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Format: "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token
      const decoded = verifyToken(token);

      if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      // 3. Get user from DB (optional but good practice)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // move to next function
    } catch (error) {
      return res.status(401).json({ message: 'Token verification failed' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

module.exports = { protect };