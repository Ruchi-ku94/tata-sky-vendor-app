const express = require("express");
const cors = require('cors')

const app = express();
const vendorRoutes = require("./src/routes/vendorRoutes")
require('./src/db/connectMongoDb');

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.use("/api/v1/vendors", vendorRoutes);

app.get("/",(req,res)=>{
    res.send("help")
})
app.listen(PORT, ()=>{
    console.log(`server listening on PORT ${PORT}`);
})