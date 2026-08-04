const crypto = require("crypto");
const { readAll, writeAll } = require("./jsonStore");
const { getLatestBalance } = require("./totals");

const STORE = "accounts";

// Applies a balance change to an account's history (positive for income,
// negative for expense) and returns the new history entry's id, so the
// caller can store it and reverse the change later if the record is deleted.
const applyAccountDelta = async (accountId, delta, date, note) => {
  const accounts = await readAll(STORE);
  const account = accounts.find((acc) => acc._id === accountId);
  if (!account) return null;

  const entry = {
    _id: crypto.randomUUID(),
    balance: getLatestBalance(account.history) + delta,
    date: new Date(date).toISOString(),
    createdAt: new Date().toISOString(),
    note,
  };

  account.history.push(entry);
  await writeAll(STORE, accounts);
  return entry._id;
};

const revertAccountEntry = async (accountId, historyEntryId) => {
  if (!accountId || !historyEntryId) return;

  const accounts = await readAll(STORE);
  const account = accounts.find((acc) => acc._id === accountId);
  if (!account) return;

  account.history = account.history.filter(
    (entry) => entry._id !== historyEntryId
  );
  await writeAll(STORE, accounts);
};

module.exports = { applyAccountDelta, revertAccountEntry };
