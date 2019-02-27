var mongoose = require('mongoose');

// By default, Promises are not available in Mongoose, so below we are setting our Native Promises to Mongoose Promises:  
mongoose.Promise = global.Promise;

// If production, process.env.MONGODB_URI is made available by Heroku, otherwise its available from our config.js file 

// 'options' that we set below (useNewUrlParser, useCreateIndex) are to avoid deprecation errors
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true
});

module.exports = {
  mongoose
};