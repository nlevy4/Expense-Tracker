import React, { useState } from "react";
import moment from "moment";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

export const INCOME_CATEGORIES = [
  "Job",
  "Online Work",
  "Gifts",
  "Financial Aid",
  "Reselling & Repayments",
  "Other",
];

const AddIncomeForm = ({onAddIncome, accounts = [], initialValues, submitLabel = "Add Income"}) => {
  const [income, setIncome] = useState(() => ({
    source: initialValues?.source || "",
    category: initialValues?.category || "",
    amount: initialValues?.amount ?? "",
    date: initialValues?.date ? moment(initialValues.date).format("YYYY-MM-DD") : "",
    icon: initialValues?.icon || "",
    note: initialValues?.note || "",
    accountId: initialValues?.accountId || "",
  }));

  const handleChange = (key, value) => setIncome({ ...income, [key]: value });

  return (
    <div>
      <EmojiPickerPopup
        icon={income.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={income.source}
        onChange={({ target }) => handleChange("source", target.value)}
        label="Income Source"
        placeholder="Freelance, Salary, etc"
        type="text"
      />

      <label className="text-[13px] text-slate-300">Category</label>
      <select
        className="input-box"
        value={income.category}
        onChange={(e) => handleChange("category", e.target.value)}
      >
        <option value="">Select a category</option>
        {INCOME_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <Input
        value={income.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder=""
        type="number"
      />

      <Input
        value={income.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
      />

      <Input
        value={income.note}
        onChange={({ target }) => handleChange("note", target.value)}
        label="Note"
        placeholder="Optional note"
        type="text"
      />

      <label className="text-[13px] text-slate-300">Add to Account</label>
      <select
        className="input-box"
        value={income.accountId}
        onChange={(e) => handleChange("accountId", e.target.value)}
      >
        <option value="">Don't update an account balance</option>
        {accounts.map((account) => (
          <option key={account._id} value={account._id}>
            {account.name}
          </option>
        ))}
      </select>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={()=>onAddIncome(income)}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
};

export default AddIncomeForm;
