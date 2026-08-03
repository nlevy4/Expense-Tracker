import React, { useState } from "react";
import moment from "moment";
import { LuTrash2, LuPlus, LuWallet } from "react-icons/lu";
import AccountHistoryChart from "../Charts/AccountHistoryChart";
import Modal from "../Modal";
import UpdateBalanceForm from "./UpdateBalanceForm";
import DeleteAlert from "../DeleteAlert";
import { addThousandsSeparator } from "../../utils/helper";

const AccountCard = ({
  account,
  onUpdateBalance,
  onDeleteAccount,
  onDeleteHistoryEntry,
}) => {
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteAccountAlert, setOpenDeleteAccountAlert] = useState(false);
  const [deleteHistoryId, setDeleteHistoryId] = useState(null);

  const chartData = [...account.history]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((entry) => ({
      label: moment(entry.date).format("Do MMM"),
      balance: entry.balance,
    }));

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center text-xl text-slate-200 bg-slate-800 rounded-full">
            {account.icon ? (
              <img src={account.icon} alt={account.name} className="w-6 h-6" />
            ) : (
              <LuWallet />
            )}
          </div>
          <div>
            <h5 className="text-lg text-slate-100">{account.name}</h5>
            <p className="text-xl font-semibold text-slate-100">
              ${addThousandsSeparator(account.balance)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="add-btn" onClick={() => setOpenUpdateModal(true)}>
            <LuPlus className="text-lg" />
            Update Balance
          </button>

          <button
            className="text-slate-500 hover:text-rose-400 cursor-pointer"
            onClick={() => setOpenDeleteAccountAlert(true)}
          >
            <LuTrash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-6">
        <AccountHistoryChart data={chartData} />
      </div>

      <div className="mt-4">
        {[...account.history]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((entry) => (
            <div
              key={entry._id}
              className="group flex items-center justify-between py-2 border-b border-slate-800 last:border-0"
            >
              <span className="text-sm text-slate-500">
                {moment(entry.date).format("Do MMM YYYY")}
                {entry.note && (
                  <span className="text-slate-600 italic"> · {entry.note}</span>
                )}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-200">
                  ${addThousandsSeparator(entry.balance)}
                </span>
                <button
                  className="text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => setDeleteHistoryId(entry._id)}
                >
                  <LuTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
      </div>

      <Modal
        isOpen={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        title={`Update ${account.name} Balance`}
      >
        <UpdateBalanceForm
          onUpdateBalance={(entry) => {
            onUpdateBalance(account._id, entry);
            setOpenUpdateModal(false);
          }}
        />
      </Modal>

      <Modal
        isOpen={openDeleteAccountAlert}
        onClose={() => setOpenDeleteAccountAlert(false)}
        title="Delete Account"
      >
        <DeleteAlert
          content={`Are you sure you want to delete "${account.name}"? This removes its entire balance history.`}
          onDelete={() => {
            onDeleteAccount(account._id);
            setOpenDeleteAccountAlert(false);
          }}
        />
      </Modal>

      <Modal
        isOpen={!!deleteHistoryId}
        onClose={() => setDeleteHistoryId(null)}
        title="Delete Balance Entry"
      >
        <DeleteAlert
          content="Are you sure you want to delete this balance entry?"
          onDelete={() => {
            onDeleteHistoryEntry(account._id, deleteHistoryId);
            setDeleteHistoryId(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default AccountCard;
