import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";

import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import IncomeOverview from "../../components/Income/IncomeOverview";
import IncomeCategoryOverview from "../../components/Income/IncomeCategoryOverview";
import IncomeList from "../../components/Income/IncomeList";
import AddIncomeModal from "../../components/Income/AddIncomeForm";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import toast from "react-hot-toast";
import DeleteAlert from "../../components/DeleteAlert";
import { filterTransactionsByMonth } from "../../components/MonthFilterBar";

const Income = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  // Get All Income Details
  const fetchIncomeDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );

      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  // Get All Accounts (for the "add to account" picker)
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

  // Shared validation for add + edit
  const validateIncome = ({ source, category, amount, date }) => {
    if (!source.trim()) return "Source is required.";
    if (!category) return "Category is required.";
    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return "Amount should be a valid number greater than 0.";
    if (!date) return "Date is required.";
    return null;
  };

  // Handle Add Income
  const handleAddIncome = async (income) => {
    const error = validateIncome(income);
    if (error) {
      toast.error(error);
      return;
    }

    const { source, category, amount, date, icon, note, accountId } = income;

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        category,
        amount,
        date,
        icon,
        note,
        accountId: accountId || undefined,
      });

      setOpenAddIncomeModal(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error adding income:",
        error.response?.data?.message || error.message
      );
    }
  };

  // Handle Edit Income
  const handleUpdateIncome = async (income) => {
    const error = validateIncome(income);
    if (error) {
      toast.error(error);
      return;
    }

    const { source, category, amount, date, icon, note, accountId } = income;

    try {
      await axiosInstance.put(API_PATHS.INCOME.UPDATE_INCOME(editingIncome._id), {
        source,
        category,
        amount,
        date,
        icon,
        note,
        accountId: accountId || undefined,
      });

      setEditingIncome(null);
      toast.success("Income updated successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error updating income:",
        error.response?.data?.message || error.message
      );
      toast.error("Something went wrong updating that income.");
    }
  };

  // Delete Income
  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income details deleted successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error deleting income:",
        error.response?.data?.message || error.message
      );
    }
  };

  // handle download income details
  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        {
          responseType: "blob", 
        }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx"); 
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url); 
    } catch (error) {
      console.error("Error downloading income details:", error);
      toast.error("Failed to download income details. Please try again.");
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
    fetchAccounts();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>

          <IncomeCategoryOverview
            transactions={filterTransactionsByMonth(incomeData, selectedMonth)}
            selectedMonth={selectedMonth}
          />

          <IncomeList
            transactions={incomeData}
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onEdit={(income) => setEditingIncome(income)}
            onDownload={handleDownloadIncomeDetails}
          />

          <Modal
            isOpen={openAddIncomeModal}
            onClose={() => setOpenAddIncomeModal(false)}
            title="Add Income"
          >
            <AddIncomeForm onAddIncome={handleAddIncome} accounts={accounts} />
          </Modal>

          <Modal
            isOpen={!!editingIncome}
            onClose={() => setEditingIncome(null)}
            title="Edit Income"
          >
            <AddIncomeForm
              onAddIncome={handleUpdateIncome}
              accounts={accounts}
              initialValues={editingIncome}
              submitLabel="Save Changes"
            />
          </Modal>

          <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
            title="Delete Income"
          >
            <DeleteAlert
              content="Are you sure you want to delete this income detail?"
              onDelete={() => deleteIncome(openDeleteAlert.data)}
            />
          </Modal>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Income;
