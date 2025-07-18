const mongoose = require('mongoose');
const Role = require('../models/role');
require('dotenv').config();

const rolesToSeed = ['SuperAdmin', 'Staff'];
const mongoDBURI = process.env.MONGOURI;
(async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoDBURI);
    console.log('MongoDB connected.\n');

    for (let roleName of rolesToSeed) {
      const existingRole = await Role.findOne({ name: roleName });

      if (existingRole) {
        console.log(`Role "${roleName}" already exists.`);
      } else {
        await Role.create({ name: roleName });
        console.log(`Role "${roleName}" created.`);
      }
    }

    console.log('\n Seeding complete.');
    mongoose.disconnect();
     process.exit(1);
  } catch (err) {
    console.error(' Error during seeding roles:\n', err);
    mongoose.disconnect();
    process.exit(1);
  }
})();
