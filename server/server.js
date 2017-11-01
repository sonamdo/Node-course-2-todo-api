var express = require('express');
var bodyParser = require('body-parser');//takes JSON and converts to JS object, attaching to request objest
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require ('./models/todo');
var {User} = require ('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());//Convert json into object, attaching it to req

app.post('/todos',(req, res)=>{//set up a route with app.post to get body data(in the form of req) from client. Sends JSON with req(uest), get it back with res(ponse)
  var todo = new Todo({//create todo with res(user input)
    text : req.body.text//sets todo
  })
  todo.save().then((doc)=>{//saves new todo, or calls error if problem
    res.send(doc);
  }, (e)=>{
    res.status(400).send(e);
    });
  });

app.get('/todos', (req,res)=>{
  Todo.find().then((todos)=>{
    res.send({todos})//creates todos object
  }, (e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos/:id',(req,res) =>{
  var id = req.params.id;

  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) =>{
    if (!todo){
      return res.status(404).send();
    }
    res.send({todo})
  }).catch((e) => {
    res.status(400).send()
})


app.delete('/todos/:id', (req,res)=>{
  var id = req.params.id;// get the id

  if (!ObjectID.isValid(id)){//validate the id -> not valid? return 404
    return res.status(404).send()
  }

  Todo.findByIdAndRemove(id).then((todo)=>{//remove todo by id
    if (!todo){
      return res.status(404).send();
    }
      res.send({todo})//if doc send doc back with 200
  }).catch((e)=>{
    return res.status(400).send();  //error? -> 400 empty body
  });
});

})//url variables created with [:]

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

// var newTodo = new Todo({//create new object for mongodb, not saved until [.save] is called on object
//   text: '   Edit     this video   '
// });
//
// newTodo.save().then((doc)=>{//.save returns a promise
//   console.log('Saved Todo', doc);
// }, (e) =>{
//   console.log('Unable to save todo')
// })

module.exports = {app};
