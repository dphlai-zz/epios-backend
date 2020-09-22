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

// LOGIN
app.post('/login/doctors', async (req, res) => {

  try {
    const {email, password} = req.body;
    const doctor = await Doctor.findOne({email, password});

    if(!doctor) {
      return res.status(401).json({error: 'Login failed! Check authentication credentials.'});
    } // if

    const token = await jwt.sign(
      {
        _id: doctor._id,
        email: doctor.email,
        name: doctor.name
      },
      SERVER_SECRET_KEY,
      {expiresIn: '72h'}
    ); // jwt.sign()

    res.json({doctor, token, success: true});

  } catch(err) {
    res.status(500).json({error: err});
  }

}); // POST /login/doctors

// curl -XPOST -d '{"email":"goose@ga.co", "password":"chicken"}' http://localhost:2854/login/doctors -H 'content-type: application/json'

app.post('/login/pharmacists', async (req, res) => {

  try {
    const {email, password} = req.body;
    const pharmacist = await Pharmacist.findOne({email, password});

    if(!pharmacist) {
      return res.status(401).json({error: 'Login failed! Check authentication credentials.'});
    } // if

    const token = await jwt.sign(
      {
        _id: pharmacist._id,
        email: pharmacist.email,
        name: pharmacist.name
      },
      SERVER_SECRET_KEY,
      {expiresIn: '72h'}
    ); // jwt.sign()

    res.json({pharmacist, token, success: true});

  } catch(err) {
    res.status(500).json({error: err});
  }

}); // POST /login/pharmacists

// curl -XPOST -d '{"email":"jen@ga.co", "password":"chicken"}' http://localhost:2854/login/pharmacists -H 'content-type: application/json'

// CREATE
app.post('/doctors', checkAuth(), async (req, res) => {

  const doctor = new Doctor(req.body);

  try {
    await doctor.save();
    res.json(doctor);
  } catch(err) {
    console.log('Query error:', err);
    res.status(500).json({error: err});
  }

}); // POST /doctors

app.post('/pharmacists', checkAuth(), async (req, res) => {

  const pharmacist = new Pharmacist(req.body);

  try {
    await pharmacist.save();
    res.json(pharmacist);
  } catch(err) {
    console.log('Query error:', err);
    res.status(500).json({error: err})
  }

}); // POST /pharmacists

app.post('/prescriptions', checkAuth(), async (req, res) => {
  const prescription = new Prescription(req.body);

  try {
    await prescription.save();
    res.json(prescription);
  } catch(err) {
    console.log('Query error:', err);
    res.status(500).json({error: err})
  }

}) // POST /prescriptions

// READ
app.get('/', checkAuth(), async (req, res) => {

  try {
    res.json({root: 'SEI37 Project Three!'})
  } catch (err) {
    console.log('Query error:', err);
    res.sendStatus(500).json({error: err});
  }

}); // GET /

app.get('/doctors', checkAuth(), async (req, res) => {

  try {
    const doctors = await Doctor.find({});
    res.json(doctors);
    // res.json(await Doctor.find())
  } catch(err) {
    console.log('Query error:', err);
    res.sendStatus(500).json({error: err});
  }

}); // GET /doctors

app.get('/doctors/:id', checkAuth(), async (req, res) => {

  try {
    const doctor = await Doctor.findOne({_id: req.params.id});
    res.json(doctor);
  } catch(err) {
    console.log('Query error:', err);
    res.sendStatus(500).json({error: err});
  }

}); // GET /doctors/:id

app.get('/pharmacists', checkAuth(), async (req, res) => {

  try {
    const pharmacists = await Pharmacist.find({});
    res.json(pharmacists);
    // res.json(await Pharmacist.find())
  } catch(err) {
    console.log('Query error:', err);
    res.sendStatus(500).json({error: err});
  }

}); // GET /pharmacists

app.get('/pharmacists/:id', checkAuth(), async (req, res) => {

  try {
    const pharmacist = await Pharmacist.findOne({_id: req.params.id});
    res.json(pharmacist);
  } catch(err) {
    console.log('Query error:', err);
    res.sendStatus(500).json({error: err});
  }

}); // GET /pharmacists/:id

app.get('/prescriptions', checkAuth(), async (req, res) => {

  try {
    const prescriptions = await Prescription.find({})
    .populate('issuedByDoctor')
    .populate('filledByPharmacist');
    res.json(prescriptions);
  } catch(err) {
    console.log('Query error:', err);
    res.sentStatus(500).json({error: err});
  }

}); // GET /prescriptions

app.get('/prescriptions/:id', checkAuth(), async (req, res) => {

  try {
    const prescription = await Prescription.findOne({_id: req.params.id})
    .populate('issuedByDoctor')
    .populate('filledByPharmacist');
    res.json(prescription);
  } catch(err) {
    console.log('Query error:', err);
    res.sendStatus(500).json({error: err});
  }

}); // GET /prescriptions/:id

// UPDATE
app.patch('/doctors/:id', checkAuth(), async (req, res) => {

  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body);
    await doctor.save();
    res.json(doctor);
  } catch(err) {
    console.log('Query error:', err);
    res.status(500).json({error: err});
  }

}); // PATCH /doctors/:id

app.patch('/pharmacists/:id', checkAuth(), async (req, res) => {

  try {
    const pharmacist = await Pharmacist.findByIdAndUpdate(req.params.id, req.body);
    await pharmacist.save();
    res.json(pharmacist);
  } catch(err) {
    console.log('Query error:', err);
    res.status(500).json({error: err});
  }

}); // PATCH /pharmacists/:id

app.patch('/prescriptions/:id', checkAuth(), async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body);
    await prescription.save();
    res.json(prescription);
  } catch(err) {
    console.log('Query error:', err);
    res.status(500).json({error: err});
  }

}); // PATCH /prescriptions/:id

// DELETE
app.delete('/doctors/:id', checkAuth(), async (req, res) => {

  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if(!doctor) res.status(404).json({notFound: true});
    res.status(200).json({success: true});
  } catch(err) {
    res.status(500).json({error: err});
  }

}) // DELETE /doctors/:id

app.delete('/pharmacists/:id', checkAuth(), async (req, res) => {

  try {
    const pharmacist = await Pharmacist.findByIdAndDelete(req.params.id);
    if(!pharmacist) res.status(404).json({notFound: true});
    res.status(200).json({sucess: true});
  } catch(err) {
    res.status(500).json({error: err});
  }

}) // DELETE /pharmacists/:id

app.delete('/prescriptions/:id', checkAuth(), async (req, res) => {

  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if(!prescription) res.staus(404).json({notFound: true});
    res.status(200).json({success: true});
  } catch(err) {
    res.status(500).json({error: err})
  }

}); // DELETE /pharmacists/:id

// curl -XPOST -d '{"name":"Dr. Ruby Bark", "password":"chicken", "principlePracticeSuburb":"Cairns", "principlePracticeState":"QLD", "principlePracticePostcode":"3123", "principlePracticeCountry":"Australia", "profession":"Podiatrist", "registrationNumber":"WOOF12345"}' http://localhost:2854/doctors -H 'content-type: application/json'

// curl -XPOST -d '{"name":"Nar Kotics", "password":"chicken", "principlePracticeSuburb":"Footscray", "principlePracticeState":"VIC", "principlePracticePostcode":"4567", "principlePracticeCountry":"Australia", "registrationNumber":"WOOF12345"}' http://localhost:2854/pharmacists -H 'content-type: application/json'

// curl -XPOST -d '{"patientName":"Mr. Frank Hop", "patientMedicareNumber":"987651", "patientAddress":"456 Pineapple Avenue, Mandarin VIC 3400", "itemName":"Telfast", "dosageInstructions":"3 times a day until complete.", "quantity":"1", "issuedByDoctor":"5f6954cd273ff8210f731387", "filledByPharmacist":"5f6954ce273ff8210f731389"}' http://localhost:2854/prescriptions -H 'content-type: application/json'

// curl -XPATCH -d '{"name":"Dr. Eddy Smith", "password":"chicken", "principlePracticeSuburb":"Brisbane", "principlePracticeState":"VIC", "principlePracticePostcode":"3245", "principlePracticeCountry":"New Zealand", "profession":"Podiatrist", "registrationNumber":"WOOF12345"}' http://localhost:2854/doctors/<OBJECT ID> -H 'content-type: application/json'

// curl -XPATCH -d '{"name":"Phar Macist", "password":"chicken", "principlePracticeSuburb":"Perth", "principlePracticeState":"WA", "principlePracticePostcode":"6877", "principlePracticeCountry":"Antarctica", "registrationNumber":"QUACK12345"}' http://localhost:2854/pharmacists/5f6962d8eecb8a25c26edc5b -H 'content-type: application/json'

// curl -XPATCH -d '{"patientName":"Mr. Frank Hop", "patientMedicareNumber":"987651", "patientAddress":"456 Pineapple Avenue, Mandarin VIC 3400", "itemName":"Telfast", "dosageInstructions":"3 times a day until complete.", "quantity":"1", "issuedByDoctor":"", "filledByPharmacist":""}' http://localhost:2854/pharmacists/5f6962d8eecb8a25c26edc5b -H 'content-type: application/json'

// curl -XDELETE http://localhost:2854/doctors/<OBJECT ID>

// curl -XDELETE http://localhost:2854/pharmacists/<OBJECT ID>

// curl -XDELETE http://localhost:2854/prescriptions/<OBJECT ID>
