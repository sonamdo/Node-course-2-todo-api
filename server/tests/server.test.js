const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server')//load server app variable through relative path
const {Todo} = require('./../models/todo')

const todos = [{
  _id : new ObjectID(),
  text : 'first test todo',
  completed: true,
  completeAt: 333
},{
  _id : new ObjectID(),
  text : 'second test todo'
}];

beforeEach((done)=>{
  Todo.remove({}).then(()=> {
    return Todo.insertMany(todos);
  }).then(() => done());//clear Todos before test;
});//testing lifecycle method, runs code before every test case

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
  })
})
//final step, edit scripts in package.json
