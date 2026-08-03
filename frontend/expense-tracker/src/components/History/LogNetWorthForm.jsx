import React, { useState } from "react";
import moment from "moment";

const LogNetWorthForm = ({ onLog }) => {
  const [date, setDate] = useState(moment().isoWeekday(1).format("YYYY-MM-DD"));

  return (
    <div>
      <p className="text-sm text-slate-400">
        This records your current net worth (accounts + income − expenses,
        right now) under the date you pick.
      </p>

      <label className="text-[13px] text-slate-300">Date</label>
      <div className="input-box">
        <input
          type="date"
          className="w-full bg-transparent outline-none"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onLog(date)}
        >
          Log Net Worth
        </button>
      </div>
    </div>
  );
};

export default LogNetWorthForm;
