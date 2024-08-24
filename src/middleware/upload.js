const multer = require('multer');
const path = require('path');

// Configure storage for multer to save files locally
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the destination directory for uploaded files
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Generate a unique name for each file
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
