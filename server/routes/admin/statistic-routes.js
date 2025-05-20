const express = require("express");
const router = express.Router();
const { getProductStatistics } = require("../../controllers/admin/statistic-controller");

router.get("/products", getProductStatistics);

module.exports = router;
