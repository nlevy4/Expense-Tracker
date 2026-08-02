import React from "react";
import { LuArrowRight, LuWallet } from "react-icons/lu";
import { addThousandsSeparator } from "../../utils/helper";

const AccountsOverview = ({ accounts, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Accounts</h5>

        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {accounts?.length ? (
          accounts.map((account) => (
            <div
              key={account._id}
              className="flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-slate-800/60"
            >
              <div className="w-12 h-12 flex items-center justify-center text-xl text-slate-200 bg-slate-800 rounded-full">
                {account.icon ? (
                  <img src={account.icon} alt={account.name} className="w-6 h-6" />
                ) : (
                  <LuWallet />
                )}
              </div>

              <div className="flex-1 flex items-center justify-between">
                <p className="text-sm text-slate-200 font-medium">
                  {account.name}
                </p>
                <p className="text-sm font-medium text-slate-100">
                  ${addThousandsSeparator(account.balance)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No accounts added yet.</p>
        )}
      </div>
    </div>
  );
};

export default AccountsOverview;
