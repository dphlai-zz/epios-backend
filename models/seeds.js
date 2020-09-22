const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const Pharmacist = require('../models/Pharmacist');
const Prescription = require('../models/Prescription');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/p3', {
  userNewUrlParser: true,
  useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', async () => {

  await Doctor.deleteMany({});
  await Pharmacist.deleteMany({});
  await Prescription.deleteMany({});

  const doctors = await seedDoctors();
  const pharmacists = await seedPharmacists();
  const prescriptions = await seedPrescriptions(doctors, pharmacists);

  await printReport();

  console.log(`Created ${doctors.length} Doctors.`);
  console.log(`Created ${pharmacists.length} Pharmacists.`);
  console.log(`Created ${prescriptions.length} Prescriptions.`);
  console.log(`Done.`);
  process.exit(0);

}); // db.once() initialiser

const seedDoctors = async () => {

  try {

    return await Doctor.create([
      {
        name: 'Dr. Goose Duck',
        email: 'goose@ga.co',
        passwordDigest: bcrypt.hashSync('chicken', 10),
        principlePracticeSuburb: 'Sydney',
        principlePracticeState: 'NSW',
        principlePracticePostcode: '2000',
        principlePracticeCountry: 'Australia',
        profession: 'General Practitioner',
        registrationNumber: 'ABC123456',
      },
      {
        name: 'Dr. Frankie Bun',
        email: 'frankie@ga.co',
        passwordDigest: bcrypt.hashSync('chicken', 10),
        principlePracticeSuburb: 'Ashfield',
        principlePracticeState: 'NSW',
        principlePracticePostcode: '2131',
        principlePracticeCountry: 'Australia',
        profession: 'Opthalmologist',
        registrationNumber: 'ABC456789',
      },

    ]); // Doctor.create()

  } catch(err){
    console.warn('Error creating doctors:', err);
    process.exit(1);
  }

}; //seedDoctors

const seedPharmacists = async () => {

  try {

    return await Pharmacist.create([
      {
        name: 'Celd Rugs',
        email: 'celd@ga.co',
        passwordDigest: bcrypt.hashSync('chicken', 10),
        principlePracticeSuburb: 'Sydney',
        principlePracticeState: 'NSW',
        principlePracticePostcode: '2000',
        principlePracticeCountry: 'Australia',
        registrationNumber: 'DEF123456',
      },
      {
        name: 'Jen Eric',
        email: 'jen@ga.co',
        passwordDigest: bcrypt.hashSync('chicken', 10),
        principlePracticeSuburb: 'Gladesville',
        principlePracticeState: 'NSW',
        principlePracticePostcode: '2111',
        principlePracticeCountry: 'Australia',
        registrationNumber: 'DEF456789',
      },

    ]); // Pharmacist.create()

  } catch(err){
    console.log('Error creating pharmacists:', err);
    process.exit(1);
  }

} // seedPharmacists

const seedPrescriptions = async (doctors, pharmacists) => {

  try {

    return await Prescription.create([
      {
        patientName: 'Mr. Bob Smith',
        patientMedicareNumber: '2367281',
        patientAddress: '123 Apple Street, Orange NSW 2123',
        itemName: 'Panadol',
        dosageInstructions: '2 tablets morning and night until complete. Take with meal.',
        quantity: '1',
        issuedByDoctor: doctors[0]._id, // req.user._id
        filledByPharmacist: pharmacists[0]._id, // req.user._id
      },
      {
        patientName: 'Ms. Jane Smith',
        patientMedicareNumber: '9873221',
        patientAddress: '234 Pear Street, Strawberry NSW 2222',
        itemName: 'Nurofen',
        dosageInstructions: '2 tablets at night until complete. Take with meal.',
        quantity: '1',
        issuedByDoctor: doctors[1]._id,
        filledByPharmacist: pharmacists[1]._id
      },

    ]); // Prescription.create()

  } catch(err){
    console.log('Error creating prescriptions:', err);
    process.exit(1);
  }

} // seedPrescriptions

const printReport = async () => {

  const yellow = '\x1b[33m',
    green = '\x1b[32m',
    blue = '\x1b[34m',
    reset = '\x1b[0m';

  const doctorCheck = await Doctor.find();

  doctorCheck.forEach(doctor => {
    console.log(doctor);
  });

  const pharmacistCheck = await Pharmacist.find();

  pharmacistCheck.forEach(pharmacist => {
    console.log(pharmacist);
  });

  const prescriptionCheck = await Prescription.find()
  .populate('issuedByDoctor')
  .populate('filledByPharmacist');

  prescriptionCheck.forEach(prescription => {
    console.log(prescription);
  }); // forEach

}; // printReport()
