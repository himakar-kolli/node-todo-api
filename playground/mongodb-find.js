const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'TodoApp';

MongoClient.connect(url, (err, client) => {
  if (err) {
    console.log(err, client);
  } else {
    const db = client.db(dbName);
    console.log("Connected successfully to server");

    // db.collection('Todos').find({
    //   _id: new ObjectID('57bb36afb3b6a3801d8c479d')
    // }).toArray().then((docs) => {
    //   console.log('Todos');
    //   console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //   console.log('Unable to fetch todos', err);
    // });

    // db.collection('Todos').find().count().then((count) => {
    //   console.log(`Todos count: ${count}`);
    // }, (err) => {
    //   console.log('Unable to fetch todos', err);
    // });

    db.collection('Users').find({
      name: 'Himakar Kolli'
    }).toArray().then((docs) => {
      console.log(JSON.stringify(docs, undefined, 2));
    });

    client.close();
  }
});