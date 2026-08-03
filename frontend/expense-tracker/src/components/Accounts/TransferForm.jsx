import React, { useState } from "react";
import moment from "moment";

const TransferForm = ({ accounts, onTransfer }) => {
  const [transfer, setTransfer] = useState({
    fromAccountId: accounts[0]?._id || "",
    toAccountId: accounts[1]?._id || accounts[0]?._id || "",
    amount: "",
    date: moment().format("YYYY-MM-DD"),
  });

  const handleChange = (key, value) =>
    setTransfer({ ...transfer, [key]: value });

  return (
    <div>
      <label className="text-[13px] text-slate-300">From Account</label>
      <select
        className="input-box"
        value={transfer.fromAccountId}
        onChange={(e) => handleChange("fromAccountId", e.target.value)}
      >
        {accounts.map((account) => (
          <option key={account._id} value={account._id}>
            {account.name}
          </option>
        ))}
      </select>

      <label className="text-[13px] text-slate-300">To Account</label>
      <select
        className="input-box"
        value={transfer.toAccountId}
        onChange={(e) => handleChange("toAccountId", e.target.value)}
      >
        {accounts.map((account) => (
          <option key={account._id} value={account._id}>
            {account.name}
          </option>
        ))}
      </select>

      <label className="text-[13px] text-slate-300">Amount</label>
      <div className="input-box">
        <input
          type="number"
          className="w-full bg-transparent outline-none"
          value={transfer.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
        />
      </div>

      <label className="text-[13px] text-slate-300">Date</label>
      <div className="input-box">
        <input
          type="date"
          className="w-full bg-transparent outline-none"
          value={transfer.date}
          onChange={(e) => handleChange("date", e.target.value)}
        />
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onTransfer(transfer)}
        >
          Transfer
        </button>
      </div>
    </div>
  );
};

export default TransferForm;
