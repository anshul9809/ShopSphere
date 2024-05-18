require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 8000;
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const {notFound, errorHandler} = require("./middlewares/errorHandler");

const dbConnect = require("./config/dbConnect");
const morgan = require("morgan"); //used to differentiate the type of request and the time


app.use(morgan());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/v1/", require("./routes/index"));

//setting the middlewares

app.use(notFound);
app.use(errorHandler);

app.listen(port, (err)=>{
    if(err){
        console.log("Error while connecting to server ", err);
        return
    }
    console.log("server running on port ", port);
});
