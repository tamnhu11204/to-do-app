const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected successfully!!!");
  } catch (err) {
    console.log("Cannot connect to MongoDB:", err);
    process.exit(1);
  }
};

module.exports = connectDB;