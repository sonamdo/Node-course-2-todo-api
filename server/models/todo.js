var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {//setting up a model so mongoose knows how to store our data
  text: {
    type: String,
    required: true,//validator
    minLength: 1,
    trim: true//removes extra spaces from front and end
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null//doesn't exist at first
  },
  _creator: {//sets the creator, so only they can access the todo
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Todo};
