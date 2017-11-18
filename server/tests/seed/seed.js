const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id : userOneId,
  email: 'sonam@test.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id : userOneId, access : 'auth'},'abc123').toString()
  }]
},{
  _id : userTwoId,
  email : 'julie@test.com',
  password : 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id : userTwoId, access : 'auth'},'abc123').toString()
  }]
}];

const todos = [{
  _id : new ObjectID(),
  text : 'first test todo',
  _creator: userOneId
},{
  _id : new ObjectID(),
  text : 'second test todo',
  completed: true,
  completeAt: 333,
  _creator : userTwoId
}];

const populateTodos = (done)=>{
  Todo.remove({}).then(()=> {
    return Todo.insertMany(todos);
  }).then(() => done());//clear Todos before test;
};//testing lifecycle method, runs code before every test case

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne,userTwo])//Promise.all takes an array of users, then executes callback when promises are resolved
  }).then(() => done());
}

module.exports = {todos, populateTodos, users, populateUsers};
