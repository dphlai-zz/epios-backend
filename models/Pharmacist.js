const mongoose = require('mongoose');

const pharmacistSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordDigest: String,
  principlePracticeSuburb: String,
  principlePracticeState: String,
  principlePracticePostcode: String,
  principlePracticeCountry: String,
  registrationNumber: String
}); // pharmacistSchema

module.exports = mongoose.model('Pharmacist', pharmacistSchema);
