const express = require("express");
const router = express.Router();
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");

const {
    createBlog, 
    updateBlog,
    getBlog
} = require("../controllers/blogController");


router.post("/create", authMiddleware, isAdmin, createBlog);

module.exports = router;