const express=require("express");
const router=express.Router();
const adminController=require("../controller/adminController");
const {verifyadminToken} = require("../middleware/adminTokenVerify");


router.get('/adminlogin',adminController.getAdminlogin);
router.post('/adminlogin',adminController.postAdminlogin);
router.get('/admindashboard',verifyadminToken,adminController.getAdminDashboard);
router.get('/adminlogout',adminController.logout);
module.exports=router;