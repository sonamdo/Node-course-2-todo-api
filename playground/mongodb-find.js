const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db)=>{
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
//change .find() value to what your looking for
  // db.collection('ToDos').find({
  //   _id: new ObjectID('59d56332be8af374a63b0bf0')
  // }).toArray().then((docs) =>{//.find() returns a MongoDB cursor which contains methods that point to documents
  //   console.log('ToDos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) =>{
  //   console.log('Unable to fetch Todos')
  // });
//.toArray returns an array of all Documents, returns promise. Hence the then call

// db.collection('ToDos').find().count().then((count) =>{//methods for mongodb can be found in documentation on mongodb website
//   console.log('ToDos count: ' + count);
// }, (err) =>{
//   console.log('Unable to fetch Todos')
// });

db.collection('users').find({
  name : 'Sonam'
}).toArray().then((docs) =>{
  console.log('Returning all Sonams'),
  console.log(JSON.stringify(docs,undefined,2));
}, (err)=>{
  console.log('Couldnt find sonam')
});

  db.close();

});
