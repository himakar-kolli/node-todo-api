var express = require('express');
var bodyParser = require('body-parser');
var {
  ObjectID
} = require('mongodb');

var {
  mongoose
} = require('./db/mongoose');
var {
  Todo
} = require('./models/todo');
var {
  User
} = require('./models/user');

var app = express();

// if on heroku, port is available at process.env.port, else port will fall back to 3000.
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({
      todos
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) { // test if the id is invalid
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
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

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {
  app
};