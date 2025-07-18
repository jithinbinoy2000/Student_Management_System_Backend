const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  module: { type: String, enum: ['student'], required: true },
  action: { type: String, enum: ['create', 'view', 'edit', 'delete'], required: true }
}, { _id: false }); // disable _id for subdocuments


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
//   role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
 role:{ type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  // permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }] // for Staff
  permissions:[permissionSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
