var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connect to mongoDB on heroku, if not, switching back to mongoDB at localhost
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', {
  useNewUrlParser: true
});

module.exports = {
  mongoose
};