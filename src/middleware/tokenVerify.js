const jwt = require('jsonwebtoken');
const secretKey = 'mysecretkey';
exports.verifyToken=(req, res, next)=> {
  const token = req.cookies.token;
 
  if (!token) return res.status(401).redirect('/userLogin');

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        console.error('Token has expired');
        return res.status(401).redirect('/userLogin');
      } else {
        console.error('Invalid token:', err.message);
        return res.status(403).redirect('/userLogin');
      }
    }
    req.user = user;
    next();
  });
}
