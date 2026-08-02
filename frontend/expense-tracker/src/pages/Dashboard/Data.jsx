import React, { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { LuCopy, LuUpload } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";

const Data = () => {
  const [exportedText, setExportedText] = useState("");
  const [importText, setImportText] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmImport, setConfirmImport] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.DATA.EXPORT);
      setExportedText(JSON.stringify(response.data, null, 2));
    } catch (error) {
      toast.error("Failed to export data");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!exportedText) return;
    await navigator.clipboard.writeText(exportedText);
    toast.success("Copied to clipboard");
  };

  const handleImport = async () => {
    let parsed;
    try {
      parsed = JSON.parse(importText);
    } catch (error) {
      toast.error("That doesn't look like valid JSON");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.DATA.IMPORT, parsed);
      toast.success("Data imported successfully");
      setImportText("");
      setConfirmImport(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to import data"
      );
    }
  };

  return (
    <DashboardLayout activeMenu="Data">
      <div className="my-5 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h5 className="text-lg">Export Data</h5>
          <p className="text-xs text-slate-400 mt-0.5">
            Pull all income, expense, and account data from this site as
            JSON, then paste it into the Import box on another deployment
            (e.g. copying from local to your live Netlify site).
          </p>

          <button className="add-btn mt-4" onClick={handleExport} disabled={loading}>
            <LuCopy className="text-lg" />
            {loading ? "Exporting..." : "Export Data"}
          </button>

          {exportedText && (
            <div className="mt-4">
              <textarea
                readOnly
                value={exportedText}
                className="w-full h-64 text-xs font-mono bg-slate-800/70 border border-slate-700 rounded p-3 text-slate-200 outline-none"
              />
              <button className="add-btn add-btn-fill mt-3" onClick={handleCopy}>
                <LuCopy className="text-lg" />
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <h5 className="text-lg">Import Data</h5>
          <p className="text-xs text-slate-400 mt-0.5">
            Paste JSON exported from another deployment. This{" "}
            <span className="text-rose-400 font-medium">overwrites</span> any
            existing income, expense, or account data on this site.
          </p>

          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste exported JSON here..."
            className="w-full h-64 text-xs font-mono bg-slate-800/70 border border-slate-700 rounded p-3 mt-4 text-slate-200 outline-none focus:border-primary/60"
          />

          <button
            className="add-btn add-btn-fill mt-3"
            onClick={() => setConfirmImport(true)}
            disabled={!importText.trim()}
          >
            <LuUpload className="text-lg" />
            Import Data
          </button>
        </div>

        <Modal
          isOpen={confirmImport}
          onClose={() => setConfirmImport(false)}
          title="Overwrite existing data?"
        >
          <div>
            <p className="text-sm text-slate-300">
              This replaces the income, expense, and account data currently
              on this site with what you're pasting in. This can't be undone.
            </p>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="add-btn add-btn-fill"
                onClick={handleImport}
              >
                Overwrite Data
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Data;
