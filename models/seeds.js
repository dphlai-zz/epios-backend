const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const Pharmacist = require('../models/Pharmacist');
const Prescription = require('../models/Prescription');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/p3', {userNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', async() => {
}); // db.once() initialiser
