const mongoose = require('mongoose');

const LostProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productCategory: { type: String, required: true },
  productCommonName: { type: String, required: true },
  status: { type: String, enum: ['Found', 'Not Found'], required: true,  default: 'Not Found'},
  lostLocation: { type: String, required: true },
  images: [{ type: String }],  // Array of image URLs
  title: { type: String, required: true },
  description: { type: String },
  lostTime: { type: String },  // Time when lost
  lostDate: { type: Date, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true },  // New field
  mobile: { type: String, required: true }, // New field
  room: {type: String, required: true}, // New field
  additionalDetails: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('lostProduct', LostProductSchema);
