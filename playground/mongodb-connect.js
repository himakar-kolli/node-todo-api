const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'TodoApp';

MongoClient.connect(url, (err, client) => {
  if (err) {
    console.log(err, client);
  } else {
    const db = client.db(dbName);
    console.log("Connected successfully to server");

    // db.collection('Todos').insertOne({
    //   text: 'Something to do',
    //   completed: false
    // }, (err, result) => {
    //   if (err) {
    //     return console.log('Unable to insert todo', err);
    //   }

    //   console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // Insert new doc into Users (name, age, location)
    // db.collection('Users').insertOne({
    //   name: 'Himakar Kolli',
    //   age: 26,
    //   location: 'NC'
    // }, (err, result) => {
    //   if (err) {
    //     return console.log('Unable to insert user', err);
    //   }

    //   console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    client.close();
  }
});