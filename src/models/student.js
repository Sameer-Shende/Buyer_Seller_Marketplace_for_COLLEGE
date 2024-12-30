const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  listedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  lostProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LostProduct' }],
  neededProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NeededProduct' }],
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  room: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('student', StudentSchema);
