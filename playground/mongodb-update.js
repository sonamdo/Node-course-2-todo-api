const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db)=>{
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

//findOneAndUpdate
// db.collection('ToDos').findOneAndUpdate({
//   _id: new ObjectID('59d909ee99b53ba507d0e0a2')
// },{
//   $set:{//using Update Operator to make changes to docoment from collection
//     completed: true
//   }
// }, {
//   returnOriginal : false//options field, check documentation on findOneAndUpdate methods.
// }).then((result)=>{
//   console.log(result);
// });

  db.collection('users').findOneAndUpdate({//use method to update documetn with different Operators ie $ic
    _id: new ObjectID('59d59650da2d047c2a56310c')
  },{
    $set:{name: 'Julie'},
    $inc:
    {
      age: 1
    }
  },{
      returnOriginal: false
    }).then((result) =>{
      console.log(result);
    });

//change name
//increment age by 1
  db.close();

});
