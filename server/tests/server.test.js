const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server')//load server app variable through relative path
const {Todo} = require('./../models/todo')

const todos = [{
  text : 'first test todo'
},{
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


//final step, edit scripts in package.json
