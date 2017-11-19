var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test'){
  var config =  require('./config.json');//autparses JSON into JS object
  var envConfig = config[env];//grabs env variable from line 3

  (Object.keys(envConfig)).forEach((key) => {//loads env object values and puts them in an array, then loops through them
    process.env[key] = envConfig[key];//sets value of key to environment
  });
}
