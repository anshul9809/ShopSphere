const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middlewares/authMiddleware");

const {
    registerUser,
    loginUser,
    logoutUser,
    forgotPasswordToken,
    resetPassword,
    updatePassword,
    handleRefreshToken
}  = require("../controllers/userController");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/update-password", authMiddleware, updatePassword);
router.get("/refresh", handleRefreshToken);


module.exports = router;