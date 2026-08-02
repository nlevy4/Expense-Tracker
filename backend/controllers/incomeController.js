const xlsx = require("xlsx");
const { readAll, insert, removeById } = require("../utils/jsonStore");

const STORE = "income";

// Add Income
exports.addIncome = async (req, res) => {
  try {
    const { icon, source, amount, date } = req.body;

    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newIncome = await insert(STORE, {
      icon,
      source,
      amount: Number(amount),
      date: new Date(date).toISOString(),
    });

    res.status(200).json(newIncome);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Income
exports.getAllIncome = async (req, res) => {
  try {
    const income = (await readAll(STORE)).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Income
exports.deleteIncome = async (req, res) => {
  try {
    await removeById(STORE, req.params.id);
    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Income Details in Excel
exports.downloadIncomeExcel = async (req, res) => {
  try {
    const income = (await readAll(STORE)).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");
    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=income_details.xlsx"
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
