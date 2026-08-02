const express = require("express");
const {
  addExpense,
  getAllExpenses,
  deleteExpense,
  downloadExpenseExcel,
} = require("../controllers/expenseController");

const router = express.Router();

router.post("/add", addExpense);
router.get("/get", getAllExpenses);
router.get("/downloadexcel", downloadExpenseExcel);
router.delete("/:id", deleteExpense);


module.exports = router;
