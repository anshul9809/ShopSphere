require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 8000;
const app = express();

const dbConnect = require("./config/dbConnect");


app.use("/api", require("./routes/index"));
app.get("/", (req,res)=>{
    res.send("Hello World");
});


app.listen(port, (err)=>{
    if(err){
        console.log("Error while connecting to server ", err);
        return
    }
    console.log("server running on port ", port);
});
