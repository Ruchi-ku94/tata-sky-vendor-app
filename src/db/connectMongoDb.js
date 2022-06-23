
const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '../../.env') })
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_CONNECT_URL)
.then(()=> console.log("database connected!!!"))
.catch(err=>{
    console.log(err)
})