const express = require("express");
const router = express.Router();

router.use("/users", require("./userRoutes"));
router.use("/admin", require("./adminRoutes"));
router.use("/product", require("./productRoutes"));

module.exports = router;