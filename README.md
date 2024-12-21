# Authentication API

A simple and robust authentication API built using Node.js and Express.js.

## Features

- **User Registration**: Allows new users to create an account.
- **User Login**: Authenticates users and generates a JSON Web Token (JWT) for session management.
- **Password Hashing**: Uses bcrypt to securely hash passwords.
- **Token-Based Authentication**: Protects routes using JWT.
- **Error Handling**: Provides descriptive error messages for common issues.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud-based)
- A package manager like `npm` or `yarn`

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Omarsa2002/Authentication_api.git
   cd Authentication_api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```plaintext
   #############################################--- PORT ---#####################################################
   PORT=5000

   #############################################--- CONFIG ---#####################################################
   APP_NAME=MyApp

   #######################development conf
   #APP=dev

   DB_USER=exampleUser
   DB_PASSWORD=examplePassword
   DB_NAME=exampleDb
   DB_CLUSTER=exampleCluster
   #######################production conf
   # APP=prod

   # DB_USER=exampleUser
   # DB_PASSWORD=examplePassword
   # DB_NAME=exampleDb
   # DB_CLUSTER=exampleCluster

   #############################################--- common config ---###################################################
   JWT_ENCRYPTION=exampleJwtEncryptionKey
   JWT_EXPIRATION=3600
   LOG_FILE_LOCATION=./logs/app.log

   BCRYPT_SALT=12

   ##############################################################################################################
   NODE_MAILER_EMAIL=example@example.com
   NODE_MAILER_PASSWORD=examplePassword

   SENDGRID_API_KEY=exampleSendgridApiKey
   SENDGRID_EMAIL_FROM=example@example.com

   #############################################################################################
   IMAGEKIT_PUBLIC_KEY="examplePublicKey"
   IMAGEKIT_PRIVATE_KEY="examplePrivateKey"
   IMAGEKIT_ENDPOINT=https://ik.imagekit.io/exampleEndpoint
   ```

4. Start the server:
   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000` by default.

## API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### User Types

This API supports three user types:
- **Admin**
- **User**
- **Company**

### Endpoints

#### 1. **Sign Up User**

**POST** `/auth/user/signup`

**Request Body:**
```json
{
    "userName": "",
    "email": "",
    "password": "",
    "phone": ""
}
```

**Headers:**
```
Content-Type: application/json
```

#### 2. **Sign Up Company**

**POST** `/auth/company/signup`

**Request Body (form-data):**
```
--form 'companyName=""' \
--form 'email=""' \
--form 'password=""' \
--form 'phone=""' \
--form 'address[address]=""' \
--form 'address[city]=""' \
--form 'address[state]=""' \
--form 'address[country]=""' \
--form 'address[postalCode]=""' \
--form 'taxCard=@"file.pdf"' \
--form 'companyLicense=@"file.pdf"' \
--form 'commercialRegister=@"file.pdf"'
```

**Headers:**
```
Content-Type: multipart/form-data
```

#### 3. **Verify Email**

**POST** `/auth/verifyemail`

**Request Body:**
```json
{
    "email": "",
    "code": ""
}
```

**Headers:**
```
Content-Type: application/json
```

#### 4. **Resend Code**

**POST** `/auth/resendcode`

**Request Body:**
```json
{
    "email": "",
    "codeType": "updatePassword"
}
```
codeType take one of two values
```
"codeType":"updatePassword"
"codeType":"activate"
```

`codeType` can take one of two values: `updatePassword` or `activate`.

**Headers:**
```
Content-Type: application/json
```

#### 5. **Login**

**POST** `/auth/login`

**Request Body:**
```json
{
    "email": "",
    "password": ""
}
```

**Headers:**
```
Content-Type: application/json
```

#### 6. **Forget Password**

**POST** `/auth/forgetpassword`

**Request Body:**
```json
{
    "email": ""
}
```

**Headers:**
```
Content-Type: application/json
```

#### 7. **Update Password**

**PUT** `/auth/setPassword`

**Request Body:**
```json
{
    "email": "",
    "code": "",
    "password": ""
}
```

**Headers:**
```
Content-Type: application/json
```

#### 8. **Logout**

**POST** `/auth/logout`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <your_token_here>
```

If you are using a mobile app for requests, include the `Authorization` header.

## Folder Structure

```
Authentication_api/
├── app/auth
├── app/db
├── app/middleware
├── app/utils
├── config/
├── .env
├── index.js
└── package.json
```

## Technologies Used

- **Node.js**: Runtime environment.
- **Express.js**: Web framework.
- **MongoDB**: Database for storing user data.
- **Mongoose**: ODM for MongoDB.
- **bcrypt**: Password hashing.
- **jsonwebtoken (JWT)**: Token-based authentication.
- **Passport.js**: Authentication middleware for Node.js.

