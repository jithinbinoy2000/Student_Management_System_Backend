//config\connectDatabase.js
const mongoose = require('mongoose')

const mongoDBURI =  process.env.MONGOURI;

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoDBURI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectToMongoDB;
