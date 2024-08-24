const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel'); // Update the path as necessary
const secretKey='adminSecret';
exports.getAdminlogin=async(req,res)=>{
    res.render('adminlogin');
}
console.log('Start of postAdminlogin function');
exports.postAdminlogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log('Inside try block');

        // Find admin by email
        const admin = await Admin.findOne({ email });
        console.log('Admin found:', admin);

        if (!admin) {
            console.log('Admin not found, redirecting to /adminlogin');
            return res.redirect('/adminlogin');
        }

        // Check if the password matches
        if (admin.password !== password) {
            console.log('Password does not match, redirecting to /adminlogin');
            return res.redirect('/adminlogin');
        }

        // Create payload for JWT
        const payload = {
            admin: {
                id: admin.id
            }
        };

        console.log('Creating token...');
        // Sign the token
        const adminToken = jwt.sign(
            payload,
            secretKey, // Use a secret key stored in your environment variables
            { expiresIn: '1h' } // Token expiration time
        );
        console.log('Generated Token:', adminToken);

        // Set the token in a cookie (you can also use localStorage on the client side)
        res.cookie('adminToken', adminToken, { httpOnly: true });
        res.status(201).json({ message: 'Signup successful', redirectUrl: '/admindashboard' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAdminDashboard = async (req, res) => {
    console.log(req.cookies); // Logs all cookies sent by the client
    const adminToken = req.cookies.admintoken;
   // Logs the specific admin token if it exists
    res.render("admin/index");
};
exports.logout = (req, res) => {
    res.clearCookie('adminToken');
    res.redirect('/adminlogin'); // Redirect to login or another appropriate page
  };
