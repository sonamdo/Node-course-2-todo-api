const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');//load server app variable through relative path
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require ('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);
//make test cases with describe\
describe('POST /todos',()=>{
  it('Should create a new todo', (done)=>{//donee argument need for asynchronous test
    var text = 'Test todo text';//setup data

    request(app)
      .post('/todos')//post request
      .send({text})//sends data from above converted to JSON by supertest
      .expect(200)
      .expect((res) =>{//assertion to test response passes criteria
        expect(res.body.text).toBe(text)
      })
      .end((err, res) =>{
        if(err){
          return done(err);
        }
//2nd test checks what was passed into mongodb is ok
        Todo.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e)=> done(e));//if either expect fails, catch. Otherwisee it will still pass
      });
  });
//2nd test case, verifies that todo is not created when bad data is sent
it('should not create todo with invalid body data', (done)=>{
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) =>{
        if(err){
          return done(err);
      }
      Todo.find().then((todos)=>{
        expect(todos.length).toBe(2);//makes sure no todos were created
        done();
      }).catch((e)=>done(e));
    });
  });
});
//3rd test case, checks that todos exist
describe('GET /todos', ()=>{
  it('should get all todos',(done) =>{
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', ()=>{
  it('should return todo doc',(done) => {
    request(app)//request from app express application
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done)
  })
  it('should return 404 if todo not found', (done) =>{
    var hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 for non-object ids', (done) =>{
    request(app)
      .get(`/todos/123abc`)
      .expect(404)
      .end(done)

  });
});

describe('DELETE /todos/:id',()=>{
  it('should remove a todo',(done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) =>{
        expect(res.body.todo._id).toBe(hexId);//try with ===
      })
      .end((err,res)=>{
        if (err){
          return done(err);
        }
        Todo.findById(hexId).then((todo) =>{
          expect(todo).toNotExist
          done();
        }).catch((e)=> done(e));
        //query database using findById toNotExist
        //expect(null).toNotExist
      })
  });

  it('should return a 404 if todo not found',(done) =>{
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done)
  });

  it('should return a 40 if object id is invalid', (done) =>{
    request(app)
      .delete(`/todos/123abc`)
      .expect(404)
      .end(done)

  });
})

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) =>{
    var hexId = todos[0]._id.toHexString();//grab id of first item
    var text = 'this should be the new text';

    request(app)
      .patch(`/todos/${hexId}`)//update text, set completed to true
      .send({
        completed : true,
        text
      })
      .expect(200)
      .expect((res) =>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number')
      })
      .end(done)//200
    //text is changed, completed is true, completedAt is a number .toBeA
  })

  it('should clear completeAt when todo is not completed', (done)=>{
    var hexId = todos[1]._id.toHexString();//grab id of second todo item
    var text = 'This is the 2nd text test'

    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      completed : false,
      text
    })//update text, set completed to false
    .expect(200)
    .expect((res) =>{
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toNotExist();
    })
    .end(done)
  });
});

describe('GET /users/me',() =>{
  it('should return user if authenticated', (done) =>{
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done)
  });
});

describe('POST /users', () =>{
  it('should create a user', (done) =>{
    var email = "example@example.com";
    var password = "abc123";

    request (app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err)
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password)
          done();
        }).catch((e) => done(e));
      });
  })

  it('should return validation errors if request is invalid',(done) => {
    var email = "exadjkf";
    var password = "";

    request (app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
  })

  it('should not create user if email in use',(done) =>{
    request (app)
      .post('/users')
      .send({
        email : "sonam@test.com"
      })
      .expect(400)
      .end(done)
  })
})

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
     .post('/users/login')
     .send({//use user from see.js
       email : users[1].email,
       password : users[1].password
     })
     .expect(200)
     .expect((res)=>{//custom expect function to test for token
       expect(res.headers['x-auth']).toExist();
     })
     .end((err,res) => {
       if (err){
         return done(err);
       }

       User.findById(users[1]._id).then((user) => {
         expect(user.tokens[0]).toInclude({
           access: 'auth',
           token: res.headers['x-auth']
         });
         done();
       }).catch((e) => done(e));
     });//querry db
  });

  it('should reject invalid log in', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email : users[1].email,
        password : '123555'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
    });
  });

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err, res) => {
      if (err){
        return done(err);
      }
      User.findById(users[0]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e) => done(e));
    })
  })
})

//final step, edit scripts in package.json
