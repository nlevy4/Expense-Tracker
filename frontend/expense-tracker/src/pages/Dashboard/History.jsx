import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { LuPlus, LuTrash2, LuChevronDown, LuChevronUp } from "react-icons/lu";
import moment from "moment";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/Modal";
import LogNetWorthForm from "../../components/History/LogNetWorthForm";
import NetWorthChart from "../../components/Charts/NetWorthChart";
import toast from "react-hot-toast";
import { addThousandsSeparator } from "../../utils/helper";

const History = () => {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openLogModal, setOpenLogModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchSnapshots = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        API_PATHS.NETWORTH.GET_ALL_SNAPSHOTS
      );

      if (response.data) {
        setSnapshots(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLog = async (date) => {
    if (!date) {
      toast.error("Date is required.");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.NETWORTH.ADD_SNAPSHOT, { date });
      setOpenLogModal(false);
      toast.success("Net worth logged");
      fetchSnapshots();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error logging net worth");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.NETWORTH.DELETE_SNAPSHOT(id));
      toast.success("Snapshot deleted");
      setDeleteId(null);
      fetchSnapshots();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting snapshot");
    }
  };

  useEffect(() => {
    fetchSnapshots();
    return () => {};
  }, []);

  const chartData = [...snapshots]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((s) => ({ date: s.date, total: s.netWorth }));

  return (
    <DashboardLayout activeMenu="History">
      <div className="my-5 mx-auto">
        <div className="card flex items-center justify-between">
          <div>
            <h5 className="text-lg">Net Worth History</h5>
            <p className="text-xs text-gray-400 mt-0.5">
              Log your net worth once a week (e.g. every Monday) to build a
              trend over time, separate from ad-hoc account updates.
            </p>
          </div>

          <button className="add-btn" onClick={() => setOpenLogModal(true)}>
            <LuPlus className="text-lg" />
            Log Net Worth
          </button>
        </div>

        {chartData.length > 1 && (
          <div className="card mt-6">
            <h5 className="text-lg">Trend</h5>
            <div className="mt-4">
              <NetWorthChart data={chartData} />
            </div>
          </div>
        )}

        <div className="card mt-6">
          <h5 className="text-lg mb-2">Snapshots</h5>

          {snapshots.length === 0 ? (
            <p className="text-sm text-slate-500 mt-4">
              No snapshots logged yet. Click "Log Net Worth" to record your
              first one.
            </p>
          ) : (
            snapshots.map((s) => {
              const hasAccounts = s.accounts?.length > 0;
              const isOpen = expandedId === s._id;

              return (
                <div
                  key={s._id}
                  className="border-b border-slate-800 last:border-0"
                >
                  <div className="group flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      {hasAccounts && (
                        <button
                          className="text-slate-500 hover:text-slate-300 cursor-pointer"
                          onClick={() => setExpandedId(isOpen ? null : s._id)}
                        >
                          {isOpen ? (
                            <LuChevronUp size={14} />
                          ) : (
                            <LuChevronDown size={14} />
                          )}
                        </button>
                      )}
                      <span className="text-sm text-slate-400">
                        {moment(s.date).format("Do MMM YYYY")}
                      </span>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className="text-xs text-slate-500 hidden sm:inline">
                        Accounts ${addThousandsSeparator(s.accountsBalance)}
                      </span>
                      <span className="text-sm font-semibold text-slate-100">
                        ${addThousandsSeparator(s.netWorth)}
                      </span>
                      <button
                        className="text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => setDeleteId(s._id)}
                      >
                        <LuTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {isOpen && hasAccounts && (
                    <div className="pb-3 pl-6 space-y-1.5">
                      {s.accounts.map((account) => (
                        <div
                          key={account._id}
                          className="flex items-center justify-between text-xs text-slate-500"
                        >
                          <span>{account.name}</span>
                          <span>${addThousandsSeparator(account.balance)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <Modal
          isOpen={openLogModal}
          onClose={() => setOpenLogModal(false)}
          title="Log Net Worth"
        >
          <LogNetWorthForm onLog={handleLog} />
        </Modal>

        <Modal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          title="Delete Snapshot"
        >
          <div>
            <p className="text-sm text-slate-300">
              Are you sure you want to delete this snapshot?
            </p>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="add-btn add-btn-fill"
                onClick={() => handleDelete(deleteId)}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default History;
