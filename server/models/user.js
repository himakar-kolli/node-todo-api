const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// A sample User model is below:
// {
//   email: 'himakar@example.com',
//   password: 'adpsofijasdfmpoijwerew',
//   tokens: [{
//     access: 'auth',
//     token: 'poijasdpfoimasdpfjiweproijwer'
//   }]
// }

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

/* 1) You can add custom methods to a mongoose model by adding them to the .method property of a model.
      These methods are available on all of its objects.
   2) Also, we can overwrite mongoose's default methods like toJSON() method below.
      Here we do that to return only id & email arguments; excluding pwd & tokens */
UserSchema.methods.toJSON = function () {
  var user = this; // explicitely assigning 'this' keyword to 'user' var here, just for better readability 
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, 'abc123').toString();

  user.tokens.push({
    access,
    token
  });

  return user.save().then(() => {
    return token;
  });
};

/* Just like our static methods in java, wherein methods belong to the class and not objects, below, by adding custom methods to the .statics property of a model, we make sure that those are available directly from the model. */
UserSchema.statics.findByToken = function (token) {
  var User = this; //notice the uppercase 'U' in User, coz representing model here and not object.
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = {
  User
}