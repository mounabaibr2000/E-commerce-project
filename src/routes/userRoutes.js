const express = require("express");
const userController = require("../controller/userController");
const {verifyToken} = require("../middleware/tokenVerify");
const router = express.Router();

router.get('/', userController.indexPage);
router.get('/home', verifyToken,userController.homePage);
router.get('/shop',  verifyToken,userController.shopPage);
router.get('/blogDetails', verifyToken, userController.blogDetailsPage);
router.get('/blog', verifyToken, userController.blogPage);
router.get('/cart', verifyToken, userController.cartPage);
router.get('/contact', verifyToken, userController.contactPage);
router.get('/main',  verifyToken,userController.mainPage);
router.get('/checkout',  verifyToken,userController.checkOutPage);
router.get('/product',  verifyToken,userController.productDetailPage);
router.get('/userLogin',userController.getuserlogin);
router.post('/userLogin',userController.postuserlogin );
router.get('/usersignup',userController.getusersignup);
router.post('/usersignup',userController.postusersignup);
router.get('/logout',verifyToken,userController.logout);

module.exports=router;