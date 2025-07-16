const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("successfully connected"))
    .catch((err)=>console.error("Mongo DB connection failed ",err));


module.exports=mongoose;