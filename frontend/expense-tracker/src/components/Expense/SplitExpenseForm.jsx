import React, { useState } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import Input from "../Inputs/Input";

const emptyRow = () => ({ category: "", amount: "" });

const SplitExpenseForm = ({ onAddSplitExpense, accounts = [] }) => {
  const [date, setDate] = useState("");
  const [accountId, setAccountId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [rows, setRows] = useState([emptyRow(), emptyRow()]);

  const updateRow = (index, key, value) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    );
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const removeRow = (index) =>
    setRows((prev) => prev.filter((_, i) => i !== index));

  const allocated = rows.reduce(
    (sum, row) => sum + (Number(row.amount) || 0),
    0
  );
  const remaining = (Number(totalAmount) || 0) - allocated;

  return (
    <div>
      <p className="text-xs text-gray-400 -mt-1 mb-2">
        Enter your credit card statement total, then break it into the
        categories it covers.
      </p>

      <Input
        value={totalAmount}
        onChange={({ target }) => setTotalAmount(target.value)}
        label="Statement Total"
        placeholder="5090"
        type="number"
      />

      <Input
        value={date}
        onChange={({ target }) => setDate(target.value)}
        label="Date"
        placeholder=""
        type="date"
      />

      <label className="text-[13px] text-slate-300">Subtract from Account</label>
      <select
        className="input-box"
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
      >
        <option value="">Don't update an account balance</option>
        {accounts.map((account) => (
          <option key={account._id} value={account._id}>
            {account.name}
          </option>
        ))}
      </select>

      <div className="mt-4 space-y-3">
        {rows.map((row, index) => (
          <div key={index} className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-[13px] text-slate-300">Category</label>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Groceries, Dining, etc"
                  className="w-full bg-transparent outline-none"
                  value={row.category}
                  onChange={(e) => updateRow(index, "category", e.target.value)}
                />
              </div>
            </div>

            <div className="w-32">
              <label className="text-[13px] text-slate-300">Amount</label>
              <div className="input-box">
                <input
                  type="number"
                  placeholder="0"
                  className="w-full bg-transparent outline-none"
                  value={row.amount}
                  onChange={(e) => updateRow(index, "amount", e.target.value)}
                />
              </div>
            </div>

            <button
              type="button"
              className="text-slate-500 hover:text-rose-400 mb-4 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={() => removeRow(index)}
              disabled={rows.length <= 1}
            >
              <LuTrash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="card-btn mt-3"
        onClick={addRow}
      >
        <LuPlus className="text-base" /> Add Category
      </button>

      <div className="flex items-center justify-between mt-5 px-1 text-sm">
        <span className="text-slate-400">
          Allocated ${allocated.toLocaleString()} of $
          {(Number(totalAmount) || 0).toLocaleString()}
        </span>
        <span
          className={
            Math.abs(remaining) < 0.01
              ? "text-emerald-400 font-medium"
              : "text-rose-400 font-medium"
          }
        >
          {Math.abs(remaining) < 0.01
            ? "Fully allocated"
            : `$${Math.abs(remaining).toLocaleString()} ${
                remaining > 0 ? "left to allocate" : "over the total"
              }`}
        </span>
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() =>
            onAddSplitExpense({ date, accountId, totalAmount, rows })
          }
        >
          Split Expense
        </button>
      </div>
    </div>
  );
};

export default SplitExpenseForm;
