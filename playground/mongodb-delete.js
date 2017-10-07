const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db)=>{
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

//deleteMany
// db.collection('ToDos').deleteMany({
//   text: 'eat lunch'
// }).then((result) =>{
//   console.log(result);
// })

//deleteOne
// db.collection('ToDos').deleteOne({
//   text: 'eat lunch'
// }).then((result) =>{
//   console.log(result);
// })

//findOneAndDelete
// db.collection('ToDos').findOneAndDelete({
//   completed: false
// }).then((result) =>{
//   console.log(result)
// })

db.collection('users').findOneAndDelete({
  _id : new ObjectID('59d594eaa4f0697b6026c139')
}).then((result)=>{
  console.log(result)
})

  db.close();

});
