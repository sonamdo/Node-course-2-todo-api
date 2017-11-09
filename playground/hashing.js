const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(10, (err,salt)=>{
//   bcrypt.hash(password, salt, (err, hash) =>{
//     console.log(hash);
//   })
// })//2 args: number of rounds/callback function

var hashedPassword = '$2a$10$vDkJnBMJIHC4JbFdQiWGIOn3pgd46NvYPLqFN3bXR5zkjsTVoR27S';

bcrypt.compare(password, hashedPassword, (err,res)=>{
  console.log(res);
})

// var data = {
//   id : 10
// }
//
// var token = jwt.sign(data, '123abc');//hashes object, adds secret, and returns token value
// console.log(token)
//
// var decoded = jwt.verify(token, '123abc');//takes token+secret and makes sure it was not manipulated
// console.log('decoded', decoded)

// var message = "I am user number 3";
// var hash = SHA256(message).toString();//encrypts message with SHA256 function, result is an Object which we convert toString
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4
// };
// var token = {
//   data, //es6 syntax, equal to var data above
//   hash : SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   console.log('data was not changed')
// } else {
//   console.log('data was changed, do not trust!')
// }
