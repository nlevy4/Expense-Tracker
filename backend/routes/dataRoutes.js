const express = require("express");
const { exportData, importData } = require("../controllers/dataController");

const router = express.Router();

router.get("/export", exportData);
router.post("/import", importData);

module.exports = router;
