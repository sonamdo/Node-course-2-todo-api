const{ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user')

// var id = '59e810dc0476d50d7e9f7d0c11';
//
// if (!ObjectID.isValid()) {//check if ObjectID is valid
//   console.log('ID is not valid')
// }

// Todo.find({
//   _id: id
// }).then((todos) => {//todos input is just the name for info from find
//   console.log('Todos', todos);
// });
//
// Todo.findOne({//stops searching at first result
//   _id: id
// }).then((todo) => {//todos input is just the name for info from find
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {//pass in ID, thats it
//   if(!todo){
//     return console.log('ID not found')
//   }
//   console.log('Todo', todo);
// }).catch((e) =>console.log(e))

User.findById('59dbea3b9b4b411c0eef714a').then((user) =>{
  if(!user){
  return console.log('User not found')
  }
  console.log(user)
}).catch((e) => console.log(e));
