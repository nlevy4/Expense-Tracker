const { getLatestBalance, computeTotals } = require("../utils/totals");

// Combine every account's balance history into a single net worth timeline
const buildNetWorthHistory = (accounts) => {
  const events = accounts.flatMap((account) =>
    account.history.map((entry) => ({
      accountId: account._id,
      balance: entry.balance,
      date: entry.date,
    }))
  );

  events.sort((a, b) => new Date(a.date) - new Date(b.date));

  const balances = {};
  const points = [];

  events.forEach((event) => {
    balances[event.accountId] = event.balance;
    const total = Object.values(balances).reduce((sum, b) => sum + b, 0);
    points.push({ date: event.date, total });
  });

  return points;
};

// dashboard data
exports.getDashboardData = async (req, res) => {
  try {
    const {
      income,
      expense,
      accounts,
      totalIncome,
      totalExpense,
      totalAccountsBalance,
      netWorth,
    } = await computeTotals();

    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const last60DaysIncomeTransactions = income
      .filter((txn) => new Date(txn.date) >= sixtyDaysAgo)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    const last30DaysExpenseTransactions = expense
      .filter((txn) => new Date(txn.date) >= thirtyDaysAgo)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const expensesLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    const lastTransactions = [
      ...[...income]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map((txn) => ({ ...txn, type: "income" })),
      ...[...expense]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map((txn) => ({ ...txn, type: "expense" })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      totalBalance: netWorth,
      totalIncome,
      totalExpenses: totalExpense,
      totalAccountsBalance,
      accounts: accounts.map((account) => ({
        _id: account._id,
        name: account.name,
        icon: account.icon,
        balance: getLatestBalance(account.history),
      })),
      netWorthHistory: buildNetWorthHistory(accounts),
      last30DaysExpenses: {
        total: expensesLast30Days,
        transactions: last30DaysExpenseTransactions,
      },
      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
