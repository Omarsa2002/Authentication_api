const express 			= require('express');
const router 			= express.Router();
const authRoute =require("./auth.controller.js")
const {validation} = require('../middleware/validation.js')
const validators = require('./auth.validation.js')
const {myMullter, HME} = require('../utils/multer')
const passport = require('passport');
const { passportAuth } = require("../utils/passport.js");
passportAuth(passport);
const authGuard = passport.authenticate("appAuth", { session: false });

//--------user--------\\
router.post("/user/signup", validation(validators.signUpUser), authRoute.signUpUser)

//--------company--------\\
router.post('/company/signup', myMullter().fields([
        { name: "taxCard", maxCount: 1 }, 
        { name: "companyLicense", maxCount: 1 }, 
        { name: "commercialRegister", maxCount: 1 }]), HME, validation(validators.signUpCompany), authRoute.signUpCompany)

//--------general--------\\
router.post("/verifyemail", validation(validators.verifyEmail), authRoute.verifyEmail)
router.post("/resendcode", validation(validators.resendCode), authRoute.resendCode)
router.post("/login", validation(validators.login), authRoute.login)
router.post("/forgetpassword", validation(validators.forgetPassword), authRoute.forgetPassword)
router.put("/setPassword", validation(validators.setPassword), authRoute.setPassword);
router.post("/logout", authGuard, authRoute.signOut)



module.exports = router;