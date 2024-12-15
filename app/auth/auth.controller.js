const userModel = require("../db/models/user.schema.js");
const { sendResponse, randomNumber, currentDate, validateExpiry } = require("../utils/util.service.js");
const constants=require("../utils/constants.js")
const { v4: uuidv4 } = require("uuid");
const { sendConfirmEmail } = require("./helper.js");
const passport = require('passport');
const jwtGenerator = require("../utils/jwt.generator.js");
const tokenSchema = require('./token.schema');
const bcrypt = require ('bcrypt');
const CONFIG = require('../../config/config.js')
const { token } = require("morgan");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CONFIG.GOOGLE_CLIENT_ID);
const {setTokenWithCookies} = require('../utils/setCookies.js');
const companyModel = require("../db/models/company.schema.js");
const { imageKit } = require("../utils/imagekit.js");


const chcekEmail = async (email) => {
    const user = await userModel.findOne({ email: email });
    const company = await companyModel.findOne({email});
    if (user||company) {
        return { exists: true}; 
    } else {
        return { exists: false, user: null };  
    }
};

const uploadFileToImageKit = async (req, fileName, companyId)=>{
    const file =await imageKit.upload(
        {
            file:req.files[fileName][0].buffer.toString('base64'), //required
            fileName: req.files[fileName][0].originalname, //required,
            folder:`pdf/company/${fileName}/${companyId}`,
            useUniqueFileName:true
        },
    );
    return file.url
}

//--------user--------\\

//.......................signUp.........................\\
const signUpUser=async(req,res,next)=>{
    try {
        const {userName,email,password,phone}=req.body;
        const user=await chcekEmail(email)           
        if(user.exists){            
            sendResponse(res,constants.RESPONSE_BAD_REQUEST,"email already exist",{},[])
        }
        else{
            const newUser=new userModel({
                userName,
                email,
                password,
                phone,
                verificationCode:randomNumber(),
                verificationCodeDate:currentDate(Date.now())
            })
            const subject="Confirmation Email Send From Luxi Application";
            const code=newUser.verificationCode;
            const info= sendConfirmEmail(newUser.email,code,subject)
            if (info) {
                const savedUser = await newUser.save();
                sendResponse(res,constants.RESPONSE_CREATED,"Your signup was completed successfully! ",savedUser.userId,{});
            }else {
                sendResponse(res,constants.RESPONSE_BAD_REQUEST,"rejected Eamil", [], []);
            }
        }
    } catch (error) {
        sendResponse(res,constants.RESPONSE_INT_SERVER_ERROR,error.message,{},constants.UNHANDLED_ERROR);
    }
}


//--------Company--------\\

//.......................signUp.........................\\
const signUpCompany = async (req, res, next)=>{
    try {
        const {email} = req.body;
        const company = await chcekEmail(email);
        if(company.exists){
            sendResponse(res,constants.RESPONSE_BAD_REQUEST,"email already exist",{},[])
        }else{
            const companyId = "Company"+uuidv4();
            if(req.files && req.files["taxCard"] && req.files["taxCard"][0]){
                if(req.files && req.files["companyLicense"] && req.files["companyLicense"][0]){
                    if(req.files && req.files["commercialRegister"] && req.files["commercialRegister"][0]){
                        const commercialRegister = await uploadFileToImageKit(req, 'commercialRegister', companyId);
                        req.body.commercialRegister = commercialRegister
                    }else{
                        return sendResponse(res, constants.RESPONSE_FORBIDDEN, "commercial Register file is require", {}, []);
                    }
                    const companyLicense = await uploadFileToImageKit(req, 'companyLicense', companyId);
                    req.body.companyLicense = companyLicense
                }else{
                    return sendResponse(res, constants.RESPONSE_FORBIDDEN, "company License file is require", {}, []);
                }
                const taxCard = await uploadFileToImageKit(req, 'taxCard', companyId);
                req.body.taxCard = taxCard
            }else{
                return sendResponse(res, constants.RESPONSE_FORBIDDEN, "tax Card file is require", {}, []);
            }
            
            const {companyName, password, phone, address, taxCard, companyLicense, commercialRegister} = req.body;
            const newCompany = new companyModel({
                companyId,
                companyName,
                email,
                password,
                phone,
                address,
                taxCard:{
                    pdfURL:taxCard,
                    pdfName:'Tax Card'
                },
                companyLicense:{
                    pdfURL:companyLicense,
                    pdfName:'Company License'
                },
                commercialRegister:{
                    pdfURL:commercialRegister,
                    pdfName:'Commercial Register'
                },
                verificationCode:randomNumber(),
                verificationCodeDate:currentDate(Date.now())
            })
            const subject="Confirmation Email Send From Luxi Application";
            const code=newCompany.verificationCode;
            const info= sendConfirmEmail(newCompany.email,code,subject)
            if (info) {
                const savedCompany = await newCompany.save();
                sendResponse(res,constants.RESPONSE_CREATED,"Your signup was completed successfully! ",savedCompany.companyId,{});
            }else {
                sendResponse(res,constants.RESPONSE_BAD_REQUEST,"rejected Eamil", [], []);
            }
        }
    } catch (error) {
        sendResponse(res,constants.RESPONSE_INT_SERVER_ERROR,error.message,{},constants.UNHANDLED_ERROR);
    }
}


//--------general--------\\

//....................verifyEmail.....................\\
const verifyEmail =async(req,res,next)=>{
    try {
        const {email,code}=req.body;
        const {user}=await chcekEmail(email)          
        if(!user||user.verificationCode!==code||user.verificationCode==null||!validateExpiry(user.verificationCodeDate,"minutes",35)){
            sendResponse(res,constants.RESPONSE_BAD_REQUEST,"Invalid code or email",{},[])
        }
        else{
            user.activateEmail = true; 
            user.verificationCode = null;
            await user.save()
            sendResponse(res,constants.RESPONSE_SUCCESS,"Email confirmed success",{},[])
        }
    } catch (error) {
        sendResponse(res,constants.RESPONSE_INT_SERVER_ERROR,error.message,{},constants.UNHANDLED_ERROR);
        
    }
}

//.........................resendActivateCode.........................//
const resendActivateCode=async(req,res,next)=>{
    try {
        const {email , codeType}=req.body;
        const {user}=await chcekEmail(email)
        if(user.activateEmail && codeType==="activate"){
            sendResponse(res,constants.RESPONSE_BAD_REQUEST,"Email already confirmed",{},[])
        }
        else{
            user.verificationCode=randomNumber(),
            user.verificationCodeDate=currentDate(Date.now())
            const subject=(codeType==="activate")? "Confirmation Email Send From Sport-Store Application":
                        "an update password Email Send From Sport-Store Application";
            const code=user.verificationCode;
            const info= sendConfirmEmail(user.email,code,subject, codeType)
            if (info) {
                await user.save();
                sendResponse(res,constants.RESPONSE_CREATED,"Code send successfully","",{});
            } else {
                sendResponse(res,constants.RESPONSE_BAD_REQUEST,"rejected Eamil", {}, []);
            }
        }
    } catch (error) {
        sendResponse(res,constants.RESPONSE_INT_SERVER_ERROR,error.message,{},constants.UNHANDLED_ERROR);
    }
}

//.......................login.........................//

const login = async (req, res, next)=>{
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return sendResponse(res, constants.RESPONSE_BAD_REQUEST, info.message, {}, [])
        }
        const accToken = await jwtGenerator({ userId: user.userId, role:user.role }, 24, "h");
        const existingToken = await tokenSchema.findOne({ userId: user.userId });
        if (existingToken) {
            await tokenSchema.updateOne(
                { userId: user.userId },
                { $set: {token: accToken } }
            );
        } else {
            newToken = new tokenSchema({
                userId: user.userId,
                token: accToken,
            });
            await newToken.save();
        }
        setTokenWithCookies(res, accToken);
        const data ={
            token: accToken,
            userId: user.userId
        }
        return sendResponse(res, constants.RESPONSE_SUCCESS, 'Login successful', data, [])
    })(req, res, next);
}

const forgetPassword = async (req, res, next) => {
    try {
        const {email} = req.body;
        const  user = await userModel.findOne({ email: email });
        if (!user || user.isDeleted) {
            sendResponse(res, constants.RESPONSE_BAD_REQUEST, "This email does not exist", {}, [])
        } else {
            const subject="an update password Email Send From Sport-Store Application";
            const code=randomNumber();
            const info= sendConfirmEmail(email,code,subject, "forget")
            if (info) {
                await userModel.findOneAndUpdate(
                    {userId: user.userId},
                    {$set:{verificationCode:code,verificationCodeDate:currentDate(Date.now())}}
                )
                sendResponse(res, constants.RESPONSE_SUCCESS, `we sent you an email at ${email}`, {}, [])
            }
        }
    } catch (error) {
        sendResponse( res,constants.RESPONSE_INT_SERVER_ERROR,error.message,{},constants.UNHANDLED_ERROR);
    }
};

const setPassword = async (req, res, next) => {
    try {
        const { password, code, email } = req.body;
        const  user = await userModel.findOne({ email });
        if (user.verificationCode === +code && validateExpiry(user.verificationCodeDate, 'minutes', 35) && code) {
            const encryptedPassword = bcrypt.hashSync(password, parseInt(CONFIG.BCRYPT_SALT));
            await userModel.updateOne(
                { userId: user.userId },
                { $set: { verificationCode: "",encryptedPassword } }
            );
            sendResponse(res, constants.RESPONSE_SUCCESS, "Set new password successful", {}, [])
        } else {
            sendResponse( res, constants.RESPONSE_BAD_REQUEST, "Invalid or expired code", "", [])
        }
    } catch (error) {
        sendResponse( res,constants.RESPONSE_INT_SERVER_ERROR,error.message,{},constants.UNHANDLED_ERROR);;
    }
};



const signOut=async(req,res,next)=>{ 
    try {
        
    } catch (error) {
        sendResponse(res,constants.RESPONSE_INT_SERVER_ERROR,error.message,"", constants.UNHANDLED_ERROR);
    }
};






module.exports={
    signUpUser,
    signUpCompany,
    verifyEmail,
    resendActivateCode,
    login,
    forgetPassword,
    setPassword,
    signOut
}