const express = require("express");
const router = express.Router();
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");

const {
    registerUser,
    loginUser,
    logoutUser,
    forgotPasswordToken,
    resetPassword,
    updatePassword,
    handleRefreshToken,
    updateUser,
    getSingleUser,
    deleteUser,
    allUsers,
    adminLogin,
    blockUser,
    unblockUser,
    getWishlist,
    addToCart,
    getUserCart,
    emptyCart
}  = require("../controllers/userController");

router.post("/admin-login", adminLogin);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/all-users", authMiddleware, isAdmin, allUsers);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/update-password", authMiddleware, updatePassword);
router.get("/refresh", handleRefreshToken);
router.post("/update-user", authMiddleware, updateUser);
router.get("/profile", authMiddleware, getSingleUser);
router.delete("/delete-user", authMiddleware, deleteUser);
router.get("/wishlist", authMiddleware, getWishlist);
router.post("/cart", authMiddleware, addToCart);
router.get("/cart", authMiddleware, getUserCart);
router.get("/empty-cart", authMiddleware, emptyCart);


module.exports = router;