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
    emptyCart,
    createOrder,
    getAllOrders,
    getUserOrders,
    getOrderByUserId,
    updateOrderStatus,
    applyCoupon,
    saveAddress
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
router.post("/save-address", authMiddleware, saveAddress);
router.delete("/delete-user", authMiddleware, deleteUser);
router.get("/wishlist", authMiddleware, getWishlist);
router.post("/cart/cash-order", authMiddleware, createOrder);
router.get("/get-orders", authMiddleware, getUserOrders);
router.get("/getallorders", authMiddleware, isAdmin, getAllOrders);
router.post("/getorderbyuser/:id", authMiddleware, isAdmin, getOrderByUserId);
router.post("/update-order-status", authMiddleware, isAdmin, updateOrderStatus);
router.post("/cart", authMiddleware, addToCart);
router.get("/cart", authMiddleware, getUserCart);
router.get("/empty-cart", authMiddleware, emptyCart);
router.post("/cart/apply-coupon", authMiddleware, applyCoupon);


module.exports = router;