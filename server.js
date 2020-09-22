const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtAuthenticate = require('express-jwt');
const Doctor = require('./models/Doctor');
const Pharmacist = require('./models/Pharmacist');
const Prescription = require('./models/Prescription');

mongoose.connect('mongodb://localhost/p3', {
  useNewUrlParser: true,
  useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){
  console.log('Connected!');
}); // db.once()

const checkAuth = () => {
  return jwtAuthenticate({
      secret: SERVER_SECRET_KEY,
      algorithms: ['HS256']
  });
}; // checkAuth

// TODO: Move into .env or .bash_profile
const SERVER_SECRET_KEY = 'notVerySecretKey!!111'

//  -------------------- EXPRESS SERVER INITIALISATION --------------------  //

const express = require('express');
const app = express();
const PORT = 2854;
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT} ...`);
})

// -------------------------------- ROUTES --------------------------------  //

app.get('/', (req, res) => {
  res.send('SEI37 Project Three!')
});

app.get('/doctors', async (req, res) => {

  try {
    const doctors = await Doctor.find({});
    res.json(doctors);
    // res.json(await Doctor.find())
  } catch(err) {
    console.log('Query error:', err);
    res.sendStatus(500);
  }

}); // GET /doctors

app.post('/doctors', async (req, res) => {

  const doctor = new Doctor(req.body);

  try {
    await doctor.save();
    res.json(doctor);
  } catch(err) {
    console.log('Query error:', err);
    res.status(500).json({error: err});
  }

}) // POST /doctors

app.patch('/doctors/:id', async (req, res) => {

  try {

  } catch(err) {

  }

}) // PATCH /doctors

app.get('/pharmacists', async (req, res) => {

  try {
    const pharmacists = await Pharmacist.find({});
    res.json(pharmacists);
    // res.json(await Pharmacist.find())
  } catch(err) {
    console.log('Query error:', err);
    res.sendStatus(500);
  }

}); // GET /pharmacists

app.get('/prescriptions', async (req, res) => {

  try {
    const prescriptions = await Prescription.find({})
    .populate('issuedByDoctor')
    .populate('filledByPharmacist');
    res.json(prescriptions);
  } catch(err) {
    console.log('Query error:', err);
    res.sentStatus(500);
  }

}); // GET /prescriptions

// curl -XPOST -d '{ "name":"Dr. Ruby Bark", "password":"chicken", "principlePracticeSuburb":"Cairns", "principlePracticeState":"QLD", "principlePracticePostcode":"3123", "principlePracticeCountry":"Australia", "profession":"Podiatrist", "registrationNumber":"WOOF12345" }' http://localhost:2854/doctors -H 'content-type: application/json'
