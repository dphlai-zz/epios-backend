const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordDigest: String,
  principlePracticeSuburb: String,
  principlePracticeState: String,
  principlePracticePostcode: String,
  principlePracticeCountry: String,
  profession: String,
  registrationNumber: String,
  issuedPrescriptions: [{
    ref: 'Prescription',
    type: mongoose.Schema.Types.ObjectId
  }]
}, {timestamps: true}); // doctorSchema

module.exports = mongoose.model('Doctor', doctorSchema);
