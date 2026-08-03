const { readAll } = require("./jsonStore");

const getLatestBalance = (history) => {
  const sorted = [...history].sort(
    (a, b) =>
      new Date(b.date) - new Date(a.date) ||
      new Date(b.createdAt) - new Date(a.createdAt)
  );
  return sorted[0]?.balance ?? 0;
};

const computeTotals = async () => {
  const [income, expense, accounts] = await Promise.all([
    readAll("income"),
    readAll("expense"),
    readAll("accounts"),
  ]);

  const totalIncome = income.reduce((sum, txn) => sum + txn.amount, 0);
  const totalExpense = expense.reduce((sum, txn) => sum + txn.amount, 0);
  const totalAccountsBalance = accounts.reduce(
    (sum, account) => sum + getLatestBalance(account.history),
    0
  );

  return {
    income,
    expense,
    accounts,
    totalIncome,
    totalExpense,
    totalAccountsBalance,
    netWorth: totalIncome - totalExpense + totalAccountsBalance,
  };
};

module.exports = { getLatestBalance, computeTotals };
