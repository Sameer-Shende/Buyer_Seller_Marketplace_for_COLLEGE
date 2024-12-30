const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/swapitup`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB:', err);
});

module.exports = mongoose;


