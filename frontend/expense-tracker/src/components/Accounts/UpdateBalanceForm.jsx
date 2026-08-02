import React, { useState } from "react";
import Input from "../Inputs/Input";
import moment from "moment";

const UpdateBalanceForm = ({ onUpdateBalance }) => {
  const [entry, setEntry] = useState({
    balance: "",
    date: moment().format("YYYY-MM-DD"),
  });

  const handleChange = (key, value) => setEntry({ ...entry, [key]: value });

  return (
    <div>
      <Input
        value={entry.balance}
        onChange={({ target }) => handleChange("balance", target.value)}
        label="New Balance"
        placeholder=""
        type="number"
      />

      <Input
        value={entry.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onUpdateBalance(entry)}
        >
          Update Balance
        </button>
      </div>
    </div>
  );
};

export default UpdateBalanceForm;
