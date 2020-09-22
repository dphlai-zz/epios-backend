const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
 patientName: String,
 patientMedicareNumber: String,
 patientAddress: String,
 itemName: String,
 dosageInstructions: String,
 quantity: Number,
 issuedByDoctor: {
   ref: 'Doctor',
   type: mongoose.Schema.Types.ObjectId,
   required: true,
 },
 filledByPharmacist: {
   ref: 'Pharmacist',
   type: mongoose.Schema.Types.ObjectId,
 }
}, {timestamps: true}); // prescriptionSchema

module.exports = mongoose.model('Prescription', prescriptionSchema)
