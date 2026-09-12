import React, { useMemo, useState } from "react";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";
import { LuDownload } from "react-icons/lu";
import MonthFilterBar, {
  filterTransactionsByMonth,
} from "../MonthFilterBar";

const IncomeList = ({ transactions, onDelete, onDownload }) => {
  const [selectedMonth, setSelectedMonth] = useState("All");

  const filteredTransactions = useMemo(
    () => filterTransactionsByMonth(transactions, selectedMonth),
    [transactions, selectedMonth]
  );

  const totalIncome = useMemo(
    () =>
      filteredTransactions?.reduce(
        (sum, income) => sum + Number(income.amount || 0),
        0
      ),
    [filteredTransactions]
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income Sources</h5>

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
          {selectedMonth === "All" ? "Total Income" : `Total for ${selectedMonth}`}
        </p>
        <p className="text-lg font-semibold text-emerald-400">
          ${totalIncome.toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {filteredTransactions?.map((income) => (
          <TransactionInfoCard
            key={income._id}
            title={income.source}
            icon={income.icon}
            date={moment(income.date).format("Do MMM YYYY")}
            amount={income.amount}
            note={income.note}
            type="income"
            onDelete={() => onDelete(income._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default IncomeList;
