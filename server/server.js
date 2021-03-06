/* 
  This sets up our basic configuration (Environment Variables, sort of) based on the Environment we are running on!
*/
require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {
  ObjectID
} = require('mongodb');

const {
  mongoose
} = require('./db/mongoose');
const {
  Todo
} = require('./models/todo');
const {
  User
} = require('./models/user');
const {
  authenticate
} = require('./middleware/authenticate');

const app = express();

/*
  If running on production, process.env.PORT is made available by Heroku, otherwise its available from our config.js file 
*/
const port = process.env.PORT;

/*
  Adding 'bodyParser' npm middleware to make sure user's inputs are valid json (application/json) types
*/
app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({ // sending todos wrapped in an object instead of sending it directly, coz for flexibility and in case we want to return more data in the future
      todos
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) { // test if the id is invalid
    return res.status(404).send(); // returning, coz otherwise the rest of the code (down below) will go on to execute.
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) { // test if the returned todo is empty, happens when no todo is found for that id
      return res.status(404).send();
    }

    res.send({ // success case, where a todo was found for that id
      todo
    });
  }).catch((e) => { // error case, when a promise is rejected
    res.status(400).send();
  });
});

app.delete('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({
      todo
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;
  /*
    Using Lodash we are 'picking' just those properties we want user to udpate (like only 'text' & 'completed')
  */
  const body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  /*
    If completed is a valid boolean & todo is 'completed' (i.e.. completed is set to true)
  */
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime(); // we set the current time in millisecs
  } else {
    body.completed = false; // setting it back to false
    body.completedAt = null; // setting it back to null, coz not completed, so there's no time
  }

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {
    $set: body, // we use $set to set any property right! here we are setting the entire body (our modified) object
  }, {
    new: true, // returns our new/modified object
    useFindAndModify: false // setting this makes sure that the deprecated 'findAndModify' is not being used here
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({
      todo
    });
  }).catch((e) => {
    res.status(400).send();
  })
});

app.post('/users', (req, res) => { // sign-up
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);

  user.save().then((user) => {
    return user.generateAuthToken();
  }).then((token) => {
    /*
      Below we respond by sending back our new 'token' as part of the response header (x-auth), and our new 'user' object  (which is diff here right, coz it has our custom properties _id & email) 
    */
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.post('/users/login', (req, res) => { // sign-in
  const body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.get('/users/me', authenticate, (req, res) => { // for me
  res.send(req.user);
});

app.delete('/users/me/token', authenticate, (req, res) => { // sign-out
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {
  app
};