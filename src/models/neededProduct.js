const mongoose = require('mongoose');

const NeededProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productCategory: { type: String, required: true },
  productCommonName: { type: String, required: true },
  status: { type: String, enum: ['Needed', 'Found'], required: true, default: 'Needed'},
  images: [{ type: String }],  // URL of image
  title: { type: String, required: true },
  description: { type: String },
  neededBy: { type: Date, required: true },
  willingToPayUpto: { type: Number },  // Amount the user is willing to pay
  whoNeeds: { type: String, required: true },  // Person who needs it
  email: { type: String, required: true },  // New field
  mobile: { type: String, required: true }, // New field
  room: {type: String, required: true}, // New field
  additionalNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('neededProduct', NeededProductSchema);
