var mongoose = require('mongoose');

mongoose.Promise = global.Promise;//loads built in native JS promise library rather then a third party one
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose}
