require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(
    process.env.DB_HOST,
    {
        useNewUrlParser : true,
        useUnifiedTopology : true
    }
)

db = mongoose.connection;

db.on('error',()=>{
    console.log("Error connecting to database");
});

db.once('open',()=>{
    console.log("Connected to database");
});