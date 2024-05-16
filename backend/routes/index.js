const express = require("express");
const router = express.Router();

router.get("/first", (req,res)=>{
    res.send("Hello World2");
});

module.exports = router;