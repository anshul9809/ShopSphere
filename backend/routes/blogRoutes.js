const express = require("express");
const router = express.Router();
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");

const {
    createBlog, 
    updateBlog,
    getBlog,
    deleteBlog,
    getAllBlogs,
    liketheBlog,
    disliketheBlog,
} = require("../controllers/blogController");


router.post("/create", authMiddleware, isAdmin, createBlog);
router.put("/likes", authMiddleware, liketheBlog);
router.put("/dislikes", authMiddleware, disliketheBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);
router.get("/:id", getBlog);
router.get("/", getAllBlogs);

module.exports = router;