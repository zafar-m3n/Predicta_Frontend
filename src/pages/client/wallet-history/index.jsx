import React, { useState, useEffect } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import DepositHistoryTable from "./components/DepositHistoryTable";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";

const WalletHistory = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("deposits");

  useEffect(() => {
    const fetchDepositHistory = async () => {
      setLoading(true);
      try {
        const res = await API.private.getDepositHistory();

        if (res.status === 200) {
          setDeposits(res.data.deposits);
        } else {
          Notification.error("Unexpected response from server while fetching history.");
        }
      } catch (error) {
        const status = error.response?.status;
        let msg = "Failed to load deposit history.";

        if (status === 401) {
          msg = "Unauthorized. Please login again.";
        } else if (status === 500) {
          msg = "Server error. Please try again later.";
        }

        Notification.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchDepositHistory();
  }, []);

  return (
    <DefaultLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Wallet History</h1>
        <p className="text-gray-500 text-sm">Track your deposit activity here.</p>
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
        <DepositHistoryTable deposits={deposits} />
      )}
    </DefaultLayout>
  );
};

export default WalletHistory;
