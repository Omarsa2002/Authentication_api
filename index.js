const express 		  = require('express');
//const i18n = require("i18n");
const compression   = require('compression')
const morgan 	      = require('morgan');
const bodyParser 	  = require('body-parser');
const passport      = require('passport');
const pe            = require('parse-error');
const cors          = require('cors');
var LOG             = require('./config/logger');
const path          = require('path');
const fs = require('fs');
const app   = express();
const CONFIG = require('./config/config');
const routes = require('./app/routes-index');
const fetch = require('cross-fetch');
const helmet  =require("helmet")
const { connectiondb } = require('./app/db/connectiondb.js');
const { addAdmin } = require('./app/utils/admin.js');
const { limit } = require('./app/utils/util.service.js');
globalThis.fetch = fetch;

require('./app/utils/passport-config.js')(passport);
//app.use(i18n.init);
//app.use(logger('dev'));
app.use(morgan('combined', { stream: LOG.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//Passport
app.use(passport.initialize());
app.use(compression())
//Log Env
// const isLocal = CONFIG.MOOD === 'dev';

// // Set log file location based on the environment
// const logDir = isLocal ? './logs' : '/tmp/logs'; // Use '/tmp/logs' for production (AWS Lambda, etc.)

// // Ensure the logs directory exists (only needed for local development)
// if (isLocal && !fs.existsSync(logDir)) {
//   fs.mkdirSync(logDir);
// }

console.log("Environment:", CONFIG.app)

//Database connection
connectiondb()

// CORS
app.use(cors());
app.use(helmet())


app.use(function(req, res, next) {
  const originalUrl = req.originalUrl;
  const method = req.method;
  const contentType = req.headers['content-type'];
  const path = req.path;
  console.log(path);
  // Paths that use form-data (file uploads), using regex to handle dynamic productId
  const formDataPaths = [
    '/common/uploadFile',
    '/api/v1/auth/company/signup',
    ///^\/api\/v1\/product\/updateproduct\/[^\/]+$/  // Regex to match '/api/v1/'
  ];

  // Check if the path matches any form-data path
  const isFormDataPath = formDataPaths.some((formDataPath) => {
    return formDataPath instanceof RegExp
      ? formDataPath.test(path)  // Test if path matches the regex
      : formDataPath === path;  // Exact string match for non-dynamic paths
  });

  // Check if the request content-type is either application/json or multipart/form-data
  if (!isFormDataPath && contentType !== 'application/json') {
      res.status(415).json({
        error: 'Unsupported Content-Type. Only application/json is allowed for this path.',
        success: false
      });
  } else if (isFormDataPath && contentType.indexOf('multipart/form-data') === -1) {
      res.status(415).json({
        error: 'Unsupported Content-Type. Only multipart/form-data is allowed for file uploads.',
        success: false
      });
  } else {
      next();
  }
});


//requests limiter
// app.use(limit)
routes.v1routes(app)
// addAdmin()

app.use('/', function(req, res){
	res.status(400).json({message:"Luxi API Server"})
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Requested resource not found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};
  LOG.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  res.json({
    message: err.message,
    error: err
  });
});

// module.exports = app;
app.listen(CONFIG.port, err => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log('Luxi API Server is listening on %s', CONFIG.port);
});


//This is here to handle all the uncaught promise rejections
app.on('unhandledRejection', error => {
  console.log(error)
  console.error('Uncaught Error', pe(error));
});
