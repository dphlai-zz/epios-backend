const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: String,
  passwordDigest: String,
  principlePracticeSuburb: Text,
  principlePracticeState: Text,
  principlePracticePostcode: Text,
  principlePracticeCountry: Text,
  profession: Text,
  registrationNumber: String,
}); // doctorSchema

module.exports = mongoose.model('Doctor', doctorSchema);
