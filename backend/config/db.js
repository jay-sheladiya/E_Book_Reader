const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);  
    console.log("MongoDB connected successfully");
    console.log("MongoDB connected successfully2");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
