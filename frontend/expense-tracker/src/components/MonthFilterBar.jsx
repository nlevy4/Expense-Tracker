import React from "react";
import moment from "moment";

// Builds a descending list of "MMM YYYY" months present in the transactions
export const getAvailableMonths = (transactions) => {
  const months = new Set();
  transactions?.forEach((t) => {
    if (t?.date) months.add(moment(t.date).format("MMM YYYY"));
  });

  return Array.from(months).sort(
    (a, b) => moment(b, "MMM YYYY").valueOf() - moment(a, "MMM YYYY").valueOf()
  );
};

export const filterTransactionsByMonth = (transactions, selectedMonth) => {
  if (selectedMonth === "All") return transactions;
  return transactions?.filter(
    (t) => moment(t?.date).format("MMM YYYY") === selectedMonth
  );
};

const MonthFilterBar = ({ transactions, selectedMonth, onSelectMonth }) => {
  const months = getAvailableMonths(transactions);

  return (
    <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
      <button
        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
          selectedMonth === "All"
            ? "bg-primary text-white"
            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
        }`}
        onClick={() => onSelectMonth("All")}
      >
        All
      </button>

      {months.map((month) => (
        <button
          key={month}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            selectedMonth === month
              ? "bg-primary text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
          onClick={() => onSelectMonth(month)}
        >
          {month}
        </button>
      ))}
    </div>
  );
};

export default MonthFilterBar;
