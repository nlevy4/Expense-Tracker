import React from "react";
import moment from "moment";
import { LuChevronDown } from "react-icons/lu";

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
    <div className="relative mt-3 w-full sm:w-56">
      <select
        className="w-full appearance-none text-sm text-slate-100 bg-slate-800/70 border border-slate-700 rounded-lg pl-3 pr-9 py-2 outline-none focus:border-primary/60 cursor-pointer transition-colors"
        value={selectedMonth}
        onChange={(e) => onSelectMonth(e.target.value)}
      >
        <option value="All">All months</option>
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
      <LuChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
    </div>
  );
};

export default MonthFilterBar;
