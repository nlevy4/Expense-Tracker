const express = require("express");
const {
  addIncome,
  updateIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExcel
} = require("../controllers/incomeController");

const router = express.Router();

router.post("/add", addIncome);
router.get("/get", getAllIncome);
router.get("/downloadexcel", downloadIncomeExcel);
router.put("/:id", updateIncome);
router.delete("/:id", deleteIncome);


module.exports = router;
