const mongoose = require('mongoose');

const pharmacistSchema = new mongoose.Schema({
  name: String,
  passwordDigest: String,
  principlePracticeSuburb: Text,
  principlePracticeState: Text,
  principlePracticePostcode: Text,
  principlePracticeCountry: Text,
  registrationNumber: String
}); // pharmacistSchema

module.exports = mongoose.model('Pharmacist', pharmacistSchema);
