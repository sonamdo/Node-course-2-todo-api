const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash')

var UserSchema = new mongoose.Schema({//schema stores all properties of object in mongoose
  email: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VAlUE} is not a valid email'
      }
    },
    password: {
      type: String,
      require: true,
      minLength: 6
    },
    tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();//converts mongoose variable to regular object

  return _.pick(userObject, ['_id', 'email'])
};

UserSchema.methods.generateAuthToken = function(){//create new instance method which adds salted hash token to schema object
  var user = this;//this stores individual document function is working on
  var access = "auth";
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(()=>{
    return token;
  });
}

var User = mongoose.model('User', UserSchema);

module.exports = {User}
