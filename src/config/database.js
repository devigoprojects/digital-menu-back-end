const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()
const connectToDatabase = async()=>{
  try {
    await mongoose.connect(`${process.env.DATABASE_URL}`);
  } catch (error) {
    console.log(`${error}`);
    process.exit(1);
  }
}

module.exports = connectToDatabase;