const {
  ObjectID
} = require('mongodb');

const {
  mongoose
} = require('./../server/db/mongoose');
const {
  Todo
} = require('./../server/models/todo');
const {
  User
} = require('./../server/models/user');

// Todo.deleteMany({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove -> //could be deprecated. Underneath, this uses MongoDB's findAndModify 
// Todo.findByIdAndRemove

// Todo.findOneAndRemove({_id: '57c4610dbb35fcbf6fda1154'}).then((todo) => {
//
// });

//Todo.findOneAndDelete -> underneath, this uses MongoDB's findOneAndDelete 
//Todo.findByIdAndDelete 

Todo.findByIdAndDelete('57c4610dbb35fcbf6fda1154').then((todo) => {
  console.log(todo);
});