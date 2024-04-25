const mongoose = require("mongoose");
require("dotenv").config();

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true, // pentru a evita avertizările de deprecare
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

exports.connectToDb = connectToDb;
