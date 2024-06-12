const express = require("express");
const router = express.Router();

router.use("/users", require("./userRoutes"));
router.use("/product", require("./productRoutes"));
router.use("/blog", require("./blogRoutes"));
router.use("/blogCategory", require("./blogCategoryRoutes"));
router.use("/coupon", require("./couponRoutes"));
router.use("/enquiry", require("./enquiryRoutes"));
router.use("/brand", require("./brandRoutes"));
router.use("/color", require("./colorRoutes"));
module.exports = router;