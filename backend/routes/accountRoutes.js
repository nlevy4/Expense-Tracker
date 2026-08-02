const express = require("express");
const {
  getAllAccounts,
  addAccount,
  addBalanceEntry,
  deleteHistoryEntry,
  deleteAccount,
} = require("../controllers/accountController");

const router = express.Router();

router.get("/get", getAllAccounts);
router.post("/add", addAccount);
router.post("/:id/balance", addBalanceEntry);
router.delete("/:id/history/:historyId", deleteHistoryEntry);
router.delete("/:id", deleteAccount);

module.exports = router;
