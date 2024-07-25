const mongoose = require('mongoose');

const valueSchema = new mongoose.Schema({
  key: String,
  value: String,
});

module.exports = mongoose.model('Value', valueSchema);