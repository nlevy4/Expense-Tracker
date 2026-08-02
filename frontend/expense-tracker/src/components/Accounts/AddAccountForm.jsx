import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddAccountForm = ({ onAddAccount }) => {
  const [account, setAccount] = useState({
    name: "",
    balance: "",
    date: "",
    icon: "",
  });

  const handleChange = (key, value) =>
    setAccount({ ...account, [key]: value });

  return (
    <div>
      <EmojiPickerPopup
        icon={account.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={account.name}
        onChange={({ target }) => handleChange("name", target.value)}
        label="Account Name"
        placeholder="Venmo, Savings, Investments, etc"
        type="text"
      />

      <Input
        value={account.balance}
        onChange={({ target }) => handleChange("balance", target.value)}
        label="Current Balance"
        placeholder=""
        type="number"
      />

      <Input
        value={account.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="As Of Date"
        placeholder=""
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onAddAccount(account)}
        >
          Add Account
        </button>
      </div>
    </div>
  );
};

export default AddAccountForm;
