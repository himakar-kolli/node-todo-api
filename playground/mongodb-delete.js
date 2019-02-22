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

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    //   console.log(result);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //   console.log(result);
    // });

    // findOneAndDelete
    db.collection('Todos').findOneAndDelete({
      completed: false
    }).then((result) => {
      console.log(result);
    });

    // db.collection('Users').deleteMany({name: 'Himakar'});

    // db.collection('Users').findOneAndDelete({
    //   _id: new ObjectID("57ac8d47878a299e5dc21bc8")
    // }).then((results) => {
    //   console.log(JSON.stringify(results, undefined, 2));
    // });

    client.close();
  }
});