const express = require("express");

const router = express.Router();
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");

const {
    createProduct,
    getProduct,
    allProducts,
    updateProduct,
    deleteProduct,
    rating,
    uploadImages
} = require("../controllers/productController");

const {uploadPhoto, productImgResize} = require("../middlewares/uploadImages");



router.post("/create", authMiddleware, isAdmin, createProduct);
router.post("/rating", authMiddleware, rating);
router.put("/update/:id", authMiddleware, isAdmin, updateProduct);
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImages);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteProduct);
router.get("/:id", getProduct);
router.get("/", allProducts);

module.exports = router;