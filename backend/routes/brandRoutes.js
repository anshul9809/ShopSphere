const express = require("express");
const router = express.Router();
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");

const {
    createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    getAllBrands
} = require("../controllers/brandController");

router.post("/", authMiddleware, isAdmin,  createBrand);
router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", authMiddleware, isAdmin, deleteBrand);
router.get("/:id", getBrand);
router.get("/", getAllBrands);

module.exports = router;