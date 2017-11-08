var {User} = require('./../models/user');

var authenticate =  (req, res, next) =>{
  var token = req.header('x-auth');//grabs token from header

  User.findByToken(token).then((user)=>{//finds appropriate user using method from user.js
    if(!user){
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e)=>{
    res.status(401).send();
  })
}

module.exports = {authenticate};
