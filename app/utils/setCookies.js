const CONFIG = require('../../config/config')
// const createCookies = (res, accToken)=>{
//     res.cookie('jwtToken', accToken, {
//         httpOnly: true,    // Prevents JavaScript access
//         secure: CONFIG.app === 'production', // Use HTTPS in production
//         sameSite: 'strict', // Prevents CSRF attacks
//         maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
//     });
// }

const setTokenWithCookies = (res, token)=>{
    const options = {
        httpOnly: true,    // Prevents JavaScript access
        secure: CONFIG.app === 'production', // Use HTTPS in production
        sameSite: 'strict', // Prevents CSRF attacks
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    }
    return res.cookie("jwtToken", token, options);
}



// module.exports = setTokenWithCookies
module.exports = {
    //createCookies
    setTokenWithCookies
}