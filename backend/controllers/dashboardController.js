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

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Group income + expense totals by calendar month, oldest first
const buildMonthlyOverview = (income, expense) => {
  const months = {};

  const addTo = (txns, key) => {
    txns.forEach((txn) => {
      const date = new Date(txn.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

      if (!months[monthKey]) {
        months[monthKey] = {
          year: date.getFullYear(),
          monthIndex: date.getMonth(),
          income: 0,
          expense: 0,
        };
      }

      months[monthKey][key] += txn.amount;
    });
  };

  addTo(income, "income");
  addTo(expense, "expense");

  return Object.values(months)
    .sort((a, b) => a.year - b.year || a.monthIndex - b.monthIndex)
    .map((entry) => ({
      month: `${MONTH_LABELS[entry.monthIndex]} ${entry.year}`,
      income: entry.income,
      expense: entry.expense,
    }));
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
      monthlyOverview: buildMonthlyOverview(income, expense),
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
