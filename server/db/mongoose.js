var mongoose = require('mongoose');

// By default, Promises are not available in Mongoose, so below we are setting our Native Promises to Mongoose Promises:  
mongoose.Promise = global.Promise;

// Connect to mongoDB on heroku, if not, switching back to mongoDB at localhost
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', {
  useNewUrlParser: true
});

module.exports = {
  mongoose
};