const xlsx = require("xlsx");
const { readAll, insert, removeById } = require("../utils/jsonStore");
const { applyAccountDelta, revertAccountEntry } = require("../utils/accountBalance");

const STORE = "expense";

// Add Expense
exports.addExpense = async (req, res) => {
  try {
    const { icon, category, amount, date, note, accountId } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let accountHistoryEntryId = null;
    if (accountId) {
      accountHistoryEntryId = await applyAccountDelta(
        accountId,
        -Number(amount),
        date,
        `Expense: ${category}`
      );

      if (!accountHistoryEntryId) {
        return res.status(404).json({ message: "Account not found" });
      }
    }

    const newExpense = await insert(STORE, {
      icon,
      category,
      amount: Number(amount),
      date: new Date(date).toISOString(),
      note: note || "",
      accountId: accountId || null,
      accountHistoryEntryId,
    });

    res.status(200).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = (await readAll(STORE)).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = (await readAll(STORE)).find(
      (item) => item._id === req.params.id
    );

    if (expense?.accountId) {
      await revertAccountEntry(expense.accountId, expense.accountHistoryEntryId);
    }

    await removeById(STORE, req.params.id);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Expense Details in Excel
exports.downloadExpenseExcel = async (req, res) => {
  try {
    const expense = (await readAll(STORE)).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
      Note: item.note || "",
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");
    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=expense_details.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
