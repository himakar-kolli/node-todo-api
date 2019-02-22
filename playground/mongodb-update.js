// const MongoClient = require('mongodb').MongoClient;
const {
  MongoClient,
  ObjectID
} = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'TodoApp';

MongoClient.connect(url, (err, client) => {
  if (err) {
    console.log(err, client);
  } else {
    const db = client.db(dbName);
    console.log("Connected successfully to server");

    // db.collection('Todos').findOneAndUpdate({
    //   _id: new ObjectID('57bc4b15b3b6a3801d8c47a2')
    // }, {
    //   $set: {
    //     completed: true
    //   }
    // }, {
    //   returnOriginal: false
    // }).then((result) => {
    //   console.log(result);
    // });

    db.collection('Users').findOneAndUpdate({
      _id: new ObjectID('57abbcf4fd13a094e481cf2c')
    }, {
      $set: {
        name: 'Himakar'
      },
      $inc: {
        age: 1
      }
    }, {
      returnOriginal: false //This makes sure it returns the updated document
    }).then((result) => {
      console.log(result);
    });

    client.close();
  }
});