const joi = require("joi");
const { AddressSchema } = require("../utils/utils.schema");


const signUpUser={
    body:joi.object().required().keys({
        userName: joi.string()
        .required()
        .min(3)
        .messages({
            'string.base': 'Username must be a string.',
            'string.empty': 'Username is required.',
            'string.min': 'Username must be at least 3 characters long.',
        }),
    email: joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Email must be a valid email address.',
            'string.empty': 'Email is required.',
        }),
    password:joi.string()
        .min(8)
        .pattern(/[A-Z]/, 'at least one uppercase letter')
        .pattern(/[a-z]/, 'at least one lowercase letter')
        .pattern(/[0-9]/, 'at least one number')
        .pattern(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'at least one special character')
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long.',
            'string.pattern.name': 'Password must include {#name}.',
            'string.empty': 'Password is required.',
        }),
    phone: joi.string()
        .min(11)
        .required()
        .messages({
            'string.min': 'Phone number must be at least 11 characters long.',
            'string.empty': 'Phone number is required.',
        }),
    })
}

// const signUpCompany={
//     body:joi.object().required().keys({
//         companyName: joi.string().required().messages({
//             'string.base': 'Company name must be a string.',
//             'string.empty': 'Company name is required.',
//         }),
//         email: joi.string().email().required().messages({
//                 'string.email': 'Email must be a valid email address.',
//                 'string.empty': 'Email is required.',
//             }),
//         password:joi.string()
//             .min(8)
//             .pattern(/[A-Z]/, 'at least one uppercase letter')
//             .pattern(/[a-z]/, 'at least one lowercase letter')
//             .pattern(/[0-9]/, 'at least one number')
//             .pattern(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'at least one special character')
//             .required()
//             .messages({
//                 'string.min': 'Password must be at least 8 characters long.',
//                 'string.pattern.name': 'Password must include {#name}.',
//                 'string.empty': 'Password is required.',
//             }),
//         phone: joi.string().min(11).required().messages({
//                 'string.min': 'Phone number must be at least 11 characters long.',
//                 'string.empty': 'Phone number is required.',
//             }),
//         address:joi.object().required().keys({
//             address: joi.string().required().messages({
//                 'string.empty': 'Address is required.'
//             }),
//             city: joi.string().required().messages({
//                 'string.empty': 'City is required.'
//             }),
//             state: joi.string().required().messages({
//                 'string.empty': 'State is required.'
//             }),
//             country: joi.string().required().messages({
//                 'string.empty': 'Country is required.'
//             }),
//             postalCode: joi.string().required().messages({
//                 'string.empty': 'Postal code is required.'
//             })
//         })
//     }),
// }

const signUpCompany = {
    body: joi.object().keys({
        companyName: joi.string().required().messages({
            'string.base': 'Company name must be a string.',
            'string.empty': 'Company name is required.'
        }),
        email: joi.string().email().required().messages({
            'string.email': 'Email must be a valid email address.',
            'string.empty': 'Email is required.'
        }),
        password: joi.string()
            .min(8)
            .pattern(/[A-Z]/, 'uppercase')
            .pattern(/[a-z]/, 'lowercase')
            .pattern(/[0-9]/, 'number')
            .pattern(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'special')
            .required()
            .messages({
                'string.min': 'Password must be at least 8 characters long.',
                'string.pattern.name': 'Password must include at least one {#name}.',
                'string.empty': 'Password is required.'
            }),
        phone: joi.string().min(11).required().messages({
            'string.min': 'Phone number must be at least 11 characters long.',
            'string.empty': 'Phone number is required.'
        }),
        address: joi.object().keys({
            address: joi.string().required().messages({
                'string.empty': 'Address is required.'
            }),
            city: joi.string().required().messages({
                'string.empty': 'City is required.'
            }),
            state: joi.string().required().messages({
                'string.empty': 'State is required.'
            }),
            country: joi.string().required().messages({
                'string.empty': 'Country is required.'
            }),
            postalCode: joi.string().required().messages({
                'string.empty': 'Postal code is required.'
            })
        })
    })
};


module.exports={
    signUpUser,
    signUpCompany
}