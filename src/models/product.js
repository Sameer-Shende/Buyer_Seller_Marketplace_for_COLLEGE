const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productCategory: { type: String, required: true },
  productCommonName: { type: String, required: true },
  usage: { type: String, enum: ['New', 'Used'], required: true },
  status: { type: String, enum: ['Sold', 'Not Sold'], required: true, default: 'Not Sold' },
  originalPrice: { type: Number, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],  // Array of image URLs
  title: { type: String, required: true },
  description: { type: String },
  ownerName: { type: String, required: true },
  email: { type: String, required: true },  // New field
  mobile: { type: String, required: true }, // New field
  room: {type: String, required: true}, // New field
}, { timestamps: true });

module.exports = mongoose.model('product', ProductSchema);
