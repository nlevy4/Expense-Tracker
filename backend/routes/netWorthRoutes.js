const express = require("express");
const {
  getAllSnapshots,
  addSnapshot,
  deleteSnapshot,
} = require("../controllers/netWorthController");

const router = express.Router();

router.get("/get", getAllSnapshots);
router.post("/add", addSnapshot);
router.delete("/:id", deleteSnapshot);

module.exports = router;
