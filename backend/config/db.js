const mongoose = require('mongoose');
require('dotenv').config();

const DB_URL = process.env.DB_URL;

const DBCONNECT = async () => {
    try{
        await mongoose.connect(DB_URL);
        console.log("DB_CONNECTED");
    }catch(error){
        console.log(error);
    }
};

module.exports = DBCONNECT;
