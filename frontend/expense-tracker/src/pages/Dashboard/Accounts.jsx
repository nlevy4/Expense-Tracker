import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { LuPlus } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/Modal";
import AddAccountForm from "../../components/Accounts/AddAccountForm";
import AccountCard from "../../components/Accounts/AccountCard";
import toast from "react-hot-toast";
import { addThousandsSeparator } from "../../utils/helper";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddAccountModal, setOpenAddAccountModal] = useState(false);

  const fetchAccounts = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        API_PATHS.ACCOUNTS.GET_ALL_ACCOUNTS
      );

      if (response.data) {
        setAccounts(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async (account) => {
    const { name, balance, date, icon } = account;

    if (!name.trim()) {
      toast.error("Account name is required.");
      return;
    }

    if (balance === "" || isNaN(balance)) {
      toast.error("Balance should be a valid number.");
      return;
    }

    if (!date) {
      toast.error("Date is required.");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.ACCOUNTS.ADD_ACCOUNT, {
        name,
        balance,
        date,
        icon,
      });

      setOpenAddAccountModal(false);
      toast.success("Account added successfully");
      fetchAccounts();
    } catch (error) {
      console.error(
        "Error adding account:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleUpdateBalance = async (accountId, entry) => {
    const { balance, date } = entry;

    if (balance === "" || isNaN(balance)) {
      toast.error("Balance should be a valid number.");
      return;
    }

    if (!date) {
      toast.error("Date is required.");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.ACCOUNTS.ADD_BALANCE(accountId), {
        balance,
        date,
      });

      toast.success("Balance updated successfully");
      fetchAccounts();
    } catch (error) {
      console.error(
        "Error updating balance:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleDeleteAccount = async (accountId) => {
    try {
      await axiosInstance.delete(API_PATHS.ACCOUNTS.DELETE_ACCOUNT(accountId));
      toast.success("Account deleted successfully");
      fetchAccounts();
    } catch (error) {
      console.error(
        "Error deleting account:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleDeleteHistoryEntry = async (accountId, historyId) => {
    try {
      await axiosInstance.delete(
        API_PATHS.ACCOUNTS.DELETE_HISTORY(accountId, historyId)
      );
      toast.success("Balance entry deleted");
      fetchAccounts();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error deleting balance entry"
      );
    }
  };

  useEffect(() => {
    fetchAccounts();
    return () => {};
  }, []);

  const totalAccountsBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  return (
    <DashboardLayout activeMenu="Accounts">
      <div className="my-5 mx-auto">
        <div className="card flex items-center justify-between">
          <div>
            <h5 className="text-lg">Accounts</h5>
            <p className="text-xs text-gray-400 mt-0.5">
              Track balances across every account — savings, checking,
              investments, Venmo, PayPal, and more.
            </p>
            <p className="text-2xl font-semibold text-slate-100 mt-3">
              ${addThousandsSeparator(totalAccountsBalance)}
            </p>
          </div>

          <button className="add-btn" onClick={() => setOpenAddAccountModal(true)}>
            <LuPlus className="text-lg" />
            Add Account
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {accounts.map((account) => (
            <AccountCard
              key={account._id}
              account={account}
              onUpdateBalance={handleUpdateBalance}
              onDeleteAccount={handleDeleteAccount}
              onDeleteHistoryEntry={handleDeleteHistoryEntry}
            />
          ))}
        </div>

        <Modal
          isOpen={openAddAccountModal}
          onClose={() => setOpenAddAccountModal(false)}
          title="Add Account"
        >
          <AddAccountForm onAddAccount={handleAddAccount} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Accounts;
