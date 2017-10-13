var express = require('express');
var bodyParser = require('body-parser');//takes JSON and converts to JS object, attaching to request objest

var {mongoose} = require('./db/mongoose');
var {Todo} = require ('./models/todo');
var {User} = require ('./models/user');

var app = express();

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

  // todo.save().then((doc)=>{
  //   res.send(doc);
  // }, (e) =>{
  //   res.status(400).send(e);
  // });

app.listen(3000, () => {
  console.log('started on port 3000');
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
