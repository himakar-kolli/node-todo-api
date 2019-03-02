const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

/*
  A sample User model is below:
  {
    email: 'himakar@example.com',
    password: 'adpsofijasdfmpoijwerew',
    tokens: [{
      access: 'auth',
      token: 'poijasdpfoimasdpfjiweproijwerzafaghwjn'
    }]
  }
*/

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

/* 
  1) You can add custom methods to a mongoose model by adding them to the .method property of a model. These methods are available on all of its objects.
  2) Also, we can overwrite mongoose's default methods like toJSON() method below. Here we do that to return only id & email arguments; excluding pwd & tokens 
*/
UserSchema.methods.toJSON = function () {
  var user = this; // explicitly assigning 'this' keyword to 'user' var here, just for better readability 
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, process.env.JWT_SECRET).toString();

  user.tokens.push({
    access,
    token
  });

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: { // pull deletes an item, array or document exactly matching the condition you specify 
      tokens: { // here we delete an entire token object (that has _id, access, token prop's) that matches the passed 'token' string 
        token
      }
    }
  });
};

/* 
  Just like our static methods in java, wherein methods belong to the class and not objects, below, by adding custom methods to the .statics property of a model, we make sure that those are available directly from the model. 
*/
UserSchema.statics.findByToken = function (token) {
  var User = this; // notice the uppercase 'U' in User, coz representing model here and not object.
  var decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({
    email
  }).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return bcrypt.compare(password, user.password).then((res) => {
      if (!res) {
        return Promise.reject();
      }
      return Promise.resolve(user);
    });
  });
};

/* 
  'pre' is a Mongoose's Middleware hook, that can be attached as a 'pre-event' to any of the mongoose's functionality (like save below)
*/
UserSchema.pre('save', function (next) {
  var user = this;

  /* 
    We want to perform password hashing only when there's a change in the password (or the very 1st time when a user creates an account) and in no other case.
    so we track password changes using isModified() in order to hash the latesh password. 
  */
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {
  User
}