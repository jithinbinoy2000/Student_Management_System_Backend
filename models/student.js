// const mongoose = require('mongoose');

// const studentSchema = new mongoose.Schema({
//   rollNumber: {
//     type: String,
//     unique: true,
//     required: true
//   },
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   age: { type: Number, required: true },
//   grade: { type: String, required: true },
//   contactInfo: {
//     phone: { type: String },
//     address: { type: String }
//   },
//   assignedTo: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('Student', studentSchema);


const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    unique: true,
    required: true
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  grade: { type: String, required: true },
  contactInfo: {
    phone: { type: String },
    address: { type: String }
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  marks: [
    {
      subject: { type: String, required: true },
      score: { type: Number, required: true },
      maxScore: { type: Number, default: 100 }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
