const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, enum: ['SuperAdmin', 'Staff'], required: true, unique: true }
});

module.exports = mongoose.model('Role', roleSchema);
