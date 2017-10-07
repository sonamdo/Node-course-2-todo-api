// const MongoClient = require('mongodb').MongoClient;//identical to code below
const {MongoClient, ObjectID} = require('mongodb')//Sets MongoClient and ObjectID to equal property of the same name from mongodb object

// var obj = new ObjectID();//Using ObjectID constuctor function that we pulled from mongodb, we create a new ID
// console.log(obj);

// var user = {name: 'Sonam', age: 30};
// var {name} = user;//set name equal to object property name
// console.log(name);
// Destructuring explained: Takes the propery of an object out and declares it as a seperate variable.
//con. Syntax is var {property} = object
MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db)=>{//database doesn't need to be created first, Mongo will do it once data is added to it
  if (err){
    return console.log('Unable to connect to MongoDB server');//return used to end program
  }
  console.log('Connected to MongoDB server');

  // db.collection('ToDos').insertOne({//creates collection as its called, then inserts into it
  //   text: 'something to do',
  //   completed: false
  //
  // },(err, result) =>{//callback error or result
  //   if (err){
  //     return console.log('Unable to insert todo', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2))//ops attribute stores all documents that were inserted. 2 is indentation
  // });
  //
  // db.close();//closes connection with DB server

// db.collection('users').insertOne({
//   name: 'Sonam',
//   age: 30,
//   location: 'Toronto'
// }, (err, result) =>{
//   if (err){
//     return console.log('Users not created', err)
//   }
//   console.log(JSON.stringify(result.ops[0]._id.getTimestamp()))//result.ops is an array of all documents that got inserted
// })
// db.close();


});//2 arguments, URl of DB and Callback function. Connects to database
