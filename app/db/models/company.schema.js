const { default: mongoose } = require("mongoose");
const { AddressSchema, pdfSchema, ImageSchema } = require("../../utils/utils.schema.js");
const bcrypt = require('bcrypt');
const CONFIG = require("../../../config/config.js");
const addPrefixedIdPlugin = require("../db.helper.js");

const companySchema=new mongoose.Schema({
    companyId:{
        type:String,
        required:true,
        unique:true
    },
    companyName:String,
    encryptedPassword:String,
    phone: String,
    email:{
        type:String,
        required:true,
        unique:true
    },
    activateEmail: {
        type: Boolean,
        default: false,
    },
    activateAccount:{
        type:Boolean,
        default:false
    },
    verificationCode:String,
    verificationCodeDate:Date,
    recoveryCode: String,
    recoveryCodeDate: Date,
    role:{
        type:String,
        enum: ['company'],
        default:"company"
    },
    address: AddressSchema,
    accountType:{
        type: String,
        enum : ['system'],
        defult: "system"
    },
    taxCard:pdfSchema,
    companyLicense:pdfSchema,
    commercialRegister:pdfSchema,
},{
    timestamps: true
})

//companySchema.plugin(addPrefixedIdPlugin, { prefix: 'Company', field: 'companyId' }); 

//this function to add virtual field to schema 
companySchema.virtual('password')
    .set(function(password) {
    this._password = password; 
})
.get(function() {
    return this._password;
});

companySchema.pre('save', async function (next) {
    if (this.password) {         
        this.encryptedPassword =  bcrypt.hashSync(this.password, parseInt(CONFIG.BCRYPT_SALT));  
    }
    next();
});

// Password comparison method
companySchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.encryptedPassword);
};

const companyModel = mongoose.model('Company', companySchema);

module.exports = companyModel;