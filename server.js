const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtAuthenticate = require('express-jwt');

const checkAuth = () => {
  return jwtAuthenticate({
      secret: SERVER_SECRET_KEY,
      algorithms: ['HS256']
  });
};

// TODO: Move into .env or .bash_profile
const SERVER_SECRET_KEY = 'notVerySecret'

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){
  console.log('Connected!');

}); // db.once()
