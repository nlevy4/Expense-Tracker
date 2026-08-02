const crypto = require("crypto");
const { readAll, writeAll } = require("../utils/jsonStore");

const STORE = "accounts";

const sortHistoryDesc = (history) =>
  [...history].sort(
    (a, b) =>
      new Date(b.date) - new Date(a.date) ||
      new Date(b.createdAt) - new Date(a.createdAt)
  );

const withComputedBalance = (account) => {
  const history = sortHistoryDesc(account.history);
  return {
    ...account,
    balance: history[0]?.balance ?? 0,
    history,
  };
};

// Get All Accounts
exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = (await readAll(STORE)).map(withComputedBalance);
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Add Account
exports.addAccount = async (req, res) => {
  try {
    const { name, icon, balance, date } = req.body;

    if (!name || balance === undefined || balance === null || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const accounts = await readAll(STORE);

    const newAccount = {
      _id: crypto.randomUUID(),
      name,
      icon,
      createdAt: new Date().toISOString(),
      history: [
        {
          _id: crypto.randomUUID(),
          balance: Number(balance),
          date: new Date(date).toISOString(),
          createdAt: new Date().toISOString(),
        },
      ],
    };

    accounts.push(newAccount);
    await writeAll(STORE, accounts);

    res.status(200).json(withComputedBalance(newAccount));
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Add a Balance Snapshot to an Account's History
exports.addBalanceEntry = async (req, res) => {
  try {
    const { balance, date } = req.body;

    if (balance === undefined || balance === null || !date) {
      return res.status(400).json({ message: "Balance and date are required" });
    }

    const accounts = await readAll(STORE);
    const account = accounts.find((acc) => acc._id === req.params.id);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    account.history.push({
      _id: crypto.randomUUID(),
      balance: Number(balance),
      date: new Date(date).toISOString(),
      createdAt: new Date().toISOString(),
    });

    await writeAll(STORE, accounts);

    res.status(200).json(withComputedBalance(account));
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a Balance Entry from an Account's History
exports.deleteHistoryEntry = async (req, res) => {
  try {
    const accounts = await readAll(STORE);
    const account = accounts.find((acc) => acc._id === req.params.id);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.history.length <= 1) {
      return res
        .status(400)
        .json({ message: "An account must have at least one balance entry" });
    }

    account.history = account.history.filter(
      (entry) => entry._id !== req.params.historyId
    );

    await writeAll(STORE, accounts);

    res.status(200).json(withComputedBalance(account));
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    const accounts = await readAll(STORE);
    const filtered = accounts.filter((acc) => acc._id !== req.params.id);
    await writeAll(STORE, filtered);
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
