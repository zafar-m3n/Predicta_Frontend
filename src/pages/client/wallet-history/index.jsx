import React, { useState, useEffect } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import DepositHistoryTable from "./components/DepositHistoryTable";
import WithdrawalHistoryTable from "./components/WithdrawalHistoryTable";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";

const WalletHistory = () => {
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("deposits");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (activeTab === "deposits") {
      fetchDepositHistory(1);
    } else if (activeTab === "withdrawals") {
      fetchWithdrawalHistory(1);
    }
  }, [activeTab]);

  const fetchDepositHistory = async (page = 1) => {
    setLoading(true);
    try {
      const res = await API.private.getDepositHistory(page);
      if (res.data.code === "OK") {
        setDeposits(res.data.data.deposits || []);
        setCurrentPage(res.data.data.page || 1);
        setTotalPages(res.data.data.totalPages || 1);
      } else {
        const msg = res.data.error || "Failed to load deposit history.";
        Notification.error(msg);
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to load deposit history.";
      Notification.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawalHistory = async (page = 1) => {
    setLoading(true);
    try {
      const res = await API.private.getWithdrawalHistory(page);
      if (res.data.code === "OK") {
        setWithdrawals(res.data.data.withdrawals || []);
        setCurrentPage(res.data.data.page || 1);
        setTotalPages(res.data.data.totalPages || 1);
      } else {
        const msg = res.data.error || "Failed to load withdrawal history.";
        Notification.error(msg);
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to load withdrawal history.";
      Notification.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (activeTab === "deposits") {
      fetchDepositHistory(page);
    } else if (activeTab === "withdrawals") {
      fetchWithdrawalHistory(page);
    }
  };

  return (
    <DefaultLayout>
      <div className="py-5">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Wallet History</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your deposit and withdrawal activities here.</p>
        </div>

        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab("deposits")}
            className={`px-4 py-2 rounded font-medium transition ${
              activeTab === "deposits"
                ? "bg-accent text-white shadow"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Deposits
          </button>
          <button
            onClick={() => setActiveTab("withdrawals")}
            className={`px-4 py-2 rounded font-medium transition ${
              activeTab === "withdrawals"
                ? "bg-accent text-white shadow"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Withdrawals
          </button>
        </div>

        {loading ? (
          <>
            <Spinner />
            <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
              {activeTab === "deposits" ? "Loading deposit history..." : "Loading withdrawal history..."}
            </p>
          </>
        ) : activeTab === "deposits" ? (
          <DepositHistoryTable
            deposits={deposits}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        ) : (
          <WithdrawalHistoryTable
            withdrawals={withdrawals}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </DefaultLayout>
  );
};

export default WalletHistory;
