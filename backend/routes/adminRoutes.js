const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

const {
    allUsers,
    adminLogin,
    blockUser,
    unblockUser,
} = require("../controllers/adminController");

router.post("/login", adminLogin)
router.get("/all_users", authMiddleware, isAdmin, allUsers);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);




module.exports = router;
