import React, { useMemo, useState } from "react";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";
import { LuDownload } from "react-icons/lu";
import MonthFilterBar, {
  filterTransactionsByMonth,
} from "../MonthFilterBar";

const ExpenseList = ({ transactions, onDelete, onDownload }) => {
  const [selectedMonth, setSelectedMonth] = useState("All");

  const filteredTransactions = useMemo(
    () => filterTransactionsByMonth(transactions, selectedMonth),
    [transactions, selectedMonth]
  );

  const totalExpense = useMemo(
    () =>
      filteredTransactions?.reduce(
        (sum, expense) => sum + Number(expense.amount || 0),
        0
      ),
    [filteredTransactions]
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">All Expanses</h5>

        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      <MonthFilterBar
        transactions={transactions}
        selectedMonth={selectedMonth}
        onSelectMonth={setSelectedMonth}
      />

      <div className="flex items-center justify-between mt-4 px-1">
        <p className="text-sm text-slate-400">
          {selectedMonth === "All" ? "Total Expenses" : `Total for ${selectedMonth}`}
        </p>
        <p className="text-lg font-semibold text-rose-400">
          ${totalExpense.toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {filteredTransactions?.map((expense) => (
          <TransactionInfoCard
            key={expense._id}
            title={expense.category}
            icon={expense.icon}
            date={moment(expense.date).format("Do MMM YYYY")}
            amount={expense.amount}
            note={expense.note}
            type="expense"
            onDelete={() => onDelete(expense._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
