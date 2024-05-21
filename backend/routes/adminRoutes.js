const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

const {
    allUsers,
    adminLogin,
    blockUser,
    unblockUser,
} = require("../controllers/adminController");

// admin routes for user
router.post("/login", adminLogin)
router.get("/all_users", authMiddleware, isAdmin, allUsers);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

//admin routes for product



module.exports = router;
