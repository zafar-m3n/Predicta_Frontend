import React, { useState, useEffect } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import DepositHistoryTable from "./components/DepositHistoryTable";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";

const WalletHistory = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("deposits");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDepositHistory(1);
  }, []);

  const fetchDepositHistory = async (page = 1) => {
    setLoading(true);
    try {
      const res = await API.private.getDepositHistory(page);
      if (res.status === 200) {
        setDeposits(res.data.deposits || []);
        setCurrentPage(res.data.page || 1);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to load deposit history.";
      Notification.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchDepositHistory(page);
  };

  return (
    <DefaultLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Wallet History</h1>
        <p className="text-gray-600">Track your deposit activity here.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("deposits")}
          className={`px-4 py-2 rounded font-medium ${
            activeTab === "deposits" ? "bg-accent text-white shadow" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Deposits
        </button>
        <button disabled className="px-4 py-2 rounded font-medium bg-gray-100 text-gray-400 cursor-not-allowed">
          Withdrawals (Coming Soon)
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading deposit history...</div>
      ) : (
        <DepositHistoryTable
          deposits={deposits}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </DefaultLayout>
  );
};

export default WalletHistory;
