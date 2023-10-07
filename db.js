const Mongoose = require('mongoose');

const dbUrl = "mongodb+srv://beepulmagar:B33pu1674123@cluster0.ggcyk4f.mongodb.net/login-system";

const connectDB = async () => {
    await Mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    console.log("MongoDB connected!");
}

module.exports = connectDB;