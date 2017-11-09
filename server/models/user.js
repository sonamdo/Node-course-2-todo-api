const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

UserSchema.statics.findByToken = function(token){//create model method
  var User = this;
  var decoded;

  try{
    decoded = jwt.verify(token, 'abc123');
  } catch (e){
    // return new Promise((resolve, reject)=>{
    //   reject();
    // })
    return Promise.reject()//same as above, but simpler
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token' : token,//searches db using token input
    'tokens.access' : 'auth'
  })
  // jwt.verify();
};

UserSchema.pre('save', function(next){//runs code before save event
  var user = this;

  if(user.isModified('password')){//tell functions to do things only when password property is modified
    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(user.password, salt, (err, hash) =>{
        user.password = hash;
        next();
      });
    });
  }else{
    next();
  }
})

var User = mongoose.model('User', UserSchema);

module.exports = {User}
