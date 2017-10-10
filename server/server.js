 var express = require('express');
var bodyParser = require('body-parser');//takes JSON and converts to Object, attaching to request objest

var {mongoose} = require('./db/mongoose');
var {Todo} = require ('./models/todo');
var {User} = require ('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos',(req, res)=>{
  var todo = new Todo ({
    text: req.body.text
  });

  todo.save().then((doc)=>{
    res.send(doc);
  }, (e) =>{
    res.status(400).send(e);
  });
});

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
