const secretKey='adminSecret';
const jwt = require('jsonwebtoken');
exports.verifyadminToken = (req, res, next) => {
    // Access the token from cookies
    const token = req.cookies.adminToken;
    console.log('Token from cookies:', token);
  
    if (token) {
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            console.error('Token has expired');
            return res.status(401).json({ message: 'Token expired, authorization denied' });
          } else {
            console.error('Invalid token:', err.message);
            return res.status(401).json({ message: 'Invalid token, authorization denied' });
          }
        } else {
          console.log('Token is valid:', decoded);
          req.user = decoded;
          next();
        }
      });
    } else {
      console.error('No token provided');
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
  };