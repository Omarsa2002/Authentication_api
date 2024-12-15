const express 			= require('express');
const router 			= express.Router();
const authRoute =require("./auth.controller.js")
const {validation} = require('../middleware/validation.js')
const validators = require('./auth.validation.js')
const {myMullter, HME} = require('../utils/multer')


//--------user--------\\
router.post("/user/signup", validation(validators.signUpUser), authRoute.signUpUser)

//--------company--------\\
router.post('/company/signup', myMullter().fields([
        { name: "taxCard", maxCount: 1 }, 
        { name: "companyLicense", maxCount: 1 }, 
        { name: "commercialRegister", maxCount: 1 }]), HME, validation(validators.signUpCompany), authRoute.signUpCompany)

//--------general--------\\
router.post("/verifyemail", authRoute.verifyEmail)
router.post("/resendcode", authRoute.resendActivateCode)
router.post("/login", authRoute.login)
router.post("/forgetpassword", authRoute.forgetPassword)
router.put("/setPassword", authRoute.setPassword);
router.post("/logout", authRoute.signOut)



module.exports = router;