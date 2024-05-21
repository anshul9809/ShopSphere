const express = require("express");
const router = express.Router();

router.use("/users", require("./userRoutes"));
//admin routes
router.use("/admin", require("./adminRoutes"));

module.exports = router;