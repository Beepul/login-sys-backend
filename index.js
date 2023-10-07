const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000



connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/routes"));



const server = app.listen(PORT, () =>
  console.log(`Server Connected to port ${PORT}`)
)


process.on("unhandledRejection", err => {
    console.log(`An error occurred: ${err.message}`)
    server.close(() => process.exit(1))
})