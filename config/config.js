require('dotenv').config();//instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.app          = process.env.APP   || 'dev';
CONFIG.port         = process.env.PORT  || '3000';

CONFIG.db_name      = process.env.DB_NAME || '..';
CONFIG.db_user      = process.env.DB_USER;
CONFIG.db_password  = process.env.DB_PASSWORD;
CONFIG.db_cluster   = process.env.DB_CLUSTER;

CONFIG.MOOD=process.env.MOOD

CONFIG.jwt_encryption  = process.env.JWT_ENCRYPTION || 'BALLOON_AIR_API@ENCRYPTION';
CONFIG.jwt_expiration  = process.env.JWT_EXPIRATION || 90000;

CONFIG.log_file_location = process.env.LOG_FILE_LOCATION;


CONFIG.BCRYPT_SALT = process.env.BCRYPT_SALT || 10;

CONFIG.DUMMY_PASSWORD = `${CONFIG.APP_NAME}_PASS$#ord`;


// CONFIG.cloudinary_name=process.env.CLOUDINARY_NAME;
// CONFIG.cloudinary_api_key=process.env.CLOUDINARY_API_KEY;
// CONFIG.cloudinary_api_secret=process.env.CLOUDINARY_API_SECRET;

//Send Grid API Configuration
// CONFIG.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
// CONFIG.SENDGRID_EMAIL_FROM = process.env.SENDGRID_EMAIL_FROM;

CONFIG.NODEMAILER_EMAIL_FROM = process.env.NODE_MAILER_EMAIL;
CONFIG.NODEMAILER_API_KEY = process.env.NODE_MAILER_PASSWORD;

CONFIG.IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;
CONFIG.IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
CONFIG.IMAGEKIT_ENDPOINT = process.env.IMAGEKIT_ENDPOINT;

// CONFIG.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// CONFIG.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

module.exports = CONFIG;
