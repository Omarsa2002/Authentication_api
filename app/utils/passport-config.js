// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const User = require('../db/models/user.schema'); 
// const companyModel = require('../db/models/company.schema.js');
// const { randomNumber, currentDate } = require("./util.service");
// const { sendConfirmEmail } = require("../auth/helper");

// module.exports = function (passport) {
//     passport.use(
//         new LocalStrategy(
//             {
//                 usernameField: 'email',
//                 passwordField: 'password',
//                 passReqToCallback: true,
//             },
//             async (req, email, password, done) => {
//                 try {
//                     const { type } = req.body;

//                     // Determine which model to query
//                     const Model = type === 'company' ? companyModel : User;
//                     if (!Model) {
//                         return done(null, false, { message: 'Invalid user type' });
//                     }

//                     // Fetch user
//                     const user = await Model.findOne({ email });
//                     if (!user) {
//                         return done(null, false, { message: 'User not found.' });
//                     }

//                     // Check password
//                     const isPasswordCorrect = user.comparePassword(password);
//                     if (!isPasswordCorrect) {
//                         return done(null, false, { message: 'Incorrect password.' });
//                     }

//                     if(user.activateAccount === false){
//                         return done(null, false, {message: "your application is being reviewed"})
//                     }

//                     // Check email activation
//                     if (!user.activateEmail) {
//                         const code = randomNumber();
//                         await Model.findOneAndUpdate(
//                             { email: user.email },
//                             { $set: { verificationCode: code, verificationCodeDate: currentDate(Date.now()) } }
//                         );
//                         await sendConfirmEmail(
//                             user.email,
//                             code,
//                             'Confirmation Email - Loxi Application'
//                         );
//                         return done(null, false, { message: 'Please activate your email first.' });
//                     }

//                     return done(null, user);
//                 } catch (error) {
//                     return done(error);
//                 }
//             }
//         )
//     );

//     // Serialize user
//     passport.serializeUser((user, done) => {
//         done(null, { id: user._id, type: user.role || 'user' });
//     });

//     // Deserialize user
//     passport.deserializeUser(async (key, done) => {
//         try {
//             const { id, type } = key;
//             const Model = type === 'company' ? companyModel : User;
//             const user = await Model.findById(id);
//             done(null, user);
//         } catch (error) {
//             done(error);
//         }
//     });
// };



// // const passport = require('passport');
// // const LocalStrategy = require('passport-local').Strategy;
// // const User = require('../db/models/user.schema');  // Adjust the path to your User model
// // const { sendResponse, randomNumber, currentDate, validateExpiry } = require("./util.service");
// // const { sendConfirmEmail } = require("../auth/helper");
// // const companyModel = require('../db/models/company.schema.js');
// // const constants = require('./constants');

// // module.exports = function(passport) {
// //     // Passport Local Strategy for authentication
// //     passport.use(new LocalStrategy({
// //             usernameField: 'email',      // We're using email as the username
// //             passwordField: 'password',    // Field for the password
// //             passReqToCallback: true
// //         },
// //         async (req, email, password, done) => {
// //             try {
// //                 let user 
// //                 const {type} = req.body;
// //                 if(type && (type === 'user' || type === 'admin')){
// //                     user = await User.findOne({ email });
// //                 }else if(type && type === 'company'){
// //                     user = await companyModel.findOne({email})
// //                 }else{
// //                     return done(null, false, { message: 'Invalid user type' });
// //                 }
// //                 if (!user) {
// //                     return done(null, false, { message: 'Incorrect email or user not exist' });
// //                 }
// //                 // Compare the password
// //                 const isPasswordCorrect = user.comparePassword(password);
// //                 if (!isPasswordCorrect) {
// //                     return done(null, false, { message: 'Incorrect password.' });
// //                 }
// //                 if(!user.activateEmail){
// //                     const code = randomNumber()
// //                     await User.findOneAndUpdate(
// //                         {userId: user.userId},
// //                         {$set:{verificationCode:code,verificationCodeDate:currentDate(Date.now())}}
// //                     )
// //                     const subject="Confirmation Email Send From Loxi Application";
// //                     const info= sendConfirmEmail(user.email,code,subject)
// //                     if (info){
// //                         return done(null, false, { message: 'please activate your email first.' });
// //                     }
// //                 }
// //                 // If credentials are correct, return the user
// //                 return done(null, user);
// //             } catch (error) {
// //                 return done(error);
// //             }
// //         }
// //     ));
// //     // Serialize user to session
// //     passport.serializeUser((user, done) => {
// //         done(null, user.id);
// //     });
// //     // Deserialize user from session
// //     passport.deserializeUser(async (id, done) => {
// //         try {
// //             const user = await User.findById(id);
// //             done(null, user);
// //         } catch (error) {
// //             done(error);
// //         }
// //     });
// // };