const { readAll, writeAll } = require("../utils/jsonStore");

const STORES = ["income", "expense", "accounts"];

// Export all data as a single JSON payload
exports.exportData = async (req, res) => {
  try {
    const [income, expense, accounts] = await Promise.all(
      STORES.map((name) => readAll(name))
    );

    res.json({ income, expense, accounts, exportedAt: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Import a JSON payload, overwriting existing data for any store it includes
exports.importData = async (req, res) => {
  try {
    const { income, expense, accounts } = req.body;

    if (
      (income && !Array.isArray(income)) ||
      (expense && !Array.isArray(expense)) ||
      (accounts && !Array.isArray(accounts))
    ) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    if (!income && !expense && !accounts) {
      return res.status(400).json({ message: "No data provided" });
    }

    await Promise.all([
      income ? writeAll("income", income) : Promise.resolve(),
      expense ? writeAll("expense", expense) : Promise.resolve(),
      accounts ? writeAll("accounts", accounts) : Promise.resolve(),
    ]);

    res.json({ message: "Data imported successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
