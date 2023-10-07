const Mongoose = require('mongoose');
require('dotenv').config();


const dbUrl = process.env.DB_URL;


const connectDB = async () => {
    await Mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    console.log("MongoDB connected!");
}

module.exports = connectDB;