const mongoose = require('mongoose');

const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: { // associating a user's _id here, this tells us which user created this todo
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {
  Todo
};