const { SEND_EMAIL_BY_NODEMAILER } = require("../utils/email.configuration.js")



const sendConfirmEmail = async (email, code, subject ,codeType = "activate") => {
    let messageBody = (codeType === "activate")? 
            `<h2 style="color: #4CAF50;">Confirmation Email Code From Luxi app</h2>
            <p style="font-size: 16px; color: #333;">Please use the code below to confirm your email address:</p>`: 
            `<h2 style="color: #4CAF50;">an update password Code From Luxi app</h2>
            <p style="font-size: 16px; color: #333;">Please use the code below to update your password:</p>`;

    const message = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; text-align: center;">
        <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
            ${messageBody}
            <h3 style="background-color: #4CAF50; color: white; padding: 10px; border-radius: 5px;">Code: ${code}</h3>
            <p style="font-size: 14px; color: #777;">If you didn't request this, you can safely ignore this email.</p>
        </div>
    </div>
    `;
    
    const info = SEND_EMAIL_BY_NODEMAILER(email, subject, message);
    return info;
};



module.exports={
    sendConfirmEmail
}