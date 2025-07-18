const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  module: { type: String, enum: ['student'], required: true },
  action: { type: String, enum: ['create', 'view', 'edit', 'delete'], required: true },
  grantedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // staff user
});

module.exports = mongoose.model('Permission', permissionSchema);
