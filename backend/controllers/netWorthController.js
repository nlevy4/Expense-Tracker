const crypto = require("crypto");
const { readAll, writeAll } = require("../utils/jsonStore");
const { computeTotals } = require("../utils/totals");

const STORE = "networth";

// Get All Net Worth Snapshots
exports.getAllSnapshots = async (req, res) => {
  try {
    const snapshots = (await readAll(STORE)).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    res.json(snapshots);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Log a Net Worth Snapshot (captures the current totals as of the given date)
exports.addSnapshot = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const { netWorth, totalAccountsBalance, totalIncome, totalExpense } =
      await computeTotals();

    const snapshots = await readAll(STORE);

    const newSnapshot = {
      _id: crypto.randomUUID(),
      date: new Date(date).toISOString(),
      netWorth,
      accountsBalance: totalAccountsBalance,
      totalIncome,
      totalExpense,
      createdAt: new Date().toISOString(),
    };

    snapshots.push(newSnapshot);
    await writeAll(STORE, snapshots);

    res.status(200).json(newSnapshot);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a Net Worth Snapshot
exports.deleteSnapshot = async (req, res) => {
  try {
    const snapshots = await readAll(STORE);
    const filtered = snapshots.filter((s) => s._id !== req.params.id);
    await writeAll(STORE, filtered);
    res.json({ message: "Snapshot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
