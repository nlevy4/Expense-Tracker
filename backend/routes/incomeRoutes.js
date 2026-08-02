const express = require("express");
const {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExcel
} = require("../controllers/incomeController");

const router = express.Router();

router.post("/add", addIncome);
router.get("/get", getAllIncome);
router.get("/downloadexcel", downloadIncomeExcel);
router.delete("/:id", deleteIncome);


module.exports = router;
