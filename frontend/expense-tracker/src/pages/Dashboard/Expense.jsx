import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";

import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import ExpenseList from "../../components/Expense/ExpenseList";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import SplitExpenseForm from "../../components/Expense/SplitExpenseForm";
import DeleteAlert from "../../components/DeleteAlert";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";

const Expense = () => {
  const navigate = useNavigate();

  const [expenseData, setExpenseData] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openSplitExpenseModal, setOpenSplitExpenseModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  // Get All Expense Details
  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  // Get All Accounts (for the "subtract from account" picker)
  const fetchAccounts = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.ACCOUNTS.GET_ALL_ACCOUNTS
      );

      if (response.data) {
        setAccounts(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    }
  };

  // Handle Add Expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon, note, accountId } = expense;

    // Validation Checks
    if (!category.trim()) {
      toast.error("Category is required.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is required.");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
        note,
        accountId: accountId || undefined,
      });

      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error adding expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  // Handle Split Expense (one credit card statement broken into categories)
  const handleSplitExpense = async ({ date, accountId, totalAmount, rows }) => {
    if (!date) {
      toast.error("Date is required.");
      return;
    }

    const cleanRows = rows
      .map((row) => ({ category: row.category.trim(), amount: Number(row.amount) }))
      .filter((row) => row.category && row.amount > 0);

    if (cleanRows.length === 0) {
      toast.error("Add at least one category with an amount.");
      return;
    }

    const allocated = cleanRows.reduce((sum, row) => sum + row.amount, 0);
    const total = Number(totalAmount);

    if (!total || total <= 0) {
      toast.error("Statement total should be a valid number greater than 0.");
      return;
    }

    if (Math.abs(allocated - total) >= 0.01) {
      toast.error(
        `Categories add up to $${allocated.toLocaleString()}, but the statement total is $${total.toLocaleString()}.`
      );
      return;
    }

    try {
      // Sequential, not Promise.all: each request reads-then-writes the
      // account's balance history, so concurrent requests would race and
      // drop updates.
      for (const row of cleanRows) {
        await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
          category: row.category,
          amount: row.amount,
          date,
          icon: "",
          note: "Credit card split",
          accountId: accountId || undefined,
        });
      }

      setOpenSplitExpenseModal(false);
      toast.success("Expense split added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error adding split expense:",
        error.response?.data?.message || error.message
      );
      toast.error("Something went wrong splitting the expense.");
      fetchExpenseDetails();
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense details deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error deleting expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  // handle download expense details
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        {
          responseType: "blob", 
        }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx"); 
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url); 
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download expense details. Please try again.");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
    fetchAccounts();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
              onSplitExpense={() => setOpenSplitExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadExpenseDetails}
          />

          <Modal
            isOpen={openAddExpenseModal}
            onClose={() => setOpenAddExpenseModal(false)}
            title="Add Expense"
          >
            <AddExpenseForm onAddExpense={handleAddExpense} accounts={accounts} />
          </Modal>

          <Modal
            isOpen={openSplitExpenseModal}
            onClose={() => setOpenSplitExpenseModal(false)}
            title="Split Credit Card Charge"
          >
            <SplitExpenseForm
              onAddSplitExpense={handleSplitExpense}
              accounts={accounts}
            />
          </Modal>

          <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
            title="Delete Expense"
          >
            <DeleteAlert
              content="Are you sure you want to delete this expense detail?"
              onDelete={() => deleteExpense(openDeleteAlert.data)}
            />
          </Modal>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
