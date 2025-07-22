import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import Icon from "@/components/ui/Icon";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import token from "@/lib/utilities";

const AdminDashboard = () => {
  const user = token.getUserData();
  const userName = user?.full_name || "Admin";

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await API.private.getAdminDashboardStats();
      if (res.status === 200 && res.data.code === "OK") {
        setStats(res.data.data);
      } else {
        Notification.error(res.data.error || "Failed to load dashboard stats.");
      }
    } catch (error) {
      let msg = "Failed to load dashboard stats.";
      if (error.response?.data?.error) {
        msg = error.response.data.error;
      }
      Notification.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <DefaultLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner />
          <p className="text-center text-gray-500 mt-4">Loading dashboard stats...</p>
        </div>
      </DefaultLayout>
    );
  }

  const Card = ({ icon, title, value, badges = [] }) => (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-4 hover:shadow-md transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        <Icon icon={icon} width={28} className="text-accent" />
      </div>
      <p className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">{value}</p>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, idx) => (
          <Badge key={idx} text={badge.text} color={badge.color} size="sm" />
        ))}
      </div>
    </div>
  );

  return (
    <DefaultLayout>
      <div className="py-5">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Welcome, {userName}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-10">
          Here is an overview of the system analytics. Monitor user activity, transactions, and other key stats at a
          glance.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            icon="mdi:account-group-outline"
            title="Total Users"
            value={stats.users.total}
            badges={[{ text: `Verified: ${stats.users.verifiedEmails}`, color: "green" }]}
          />

          <Card icon="mdi:account-outline" title="Total Clients" value={stats.users.clients} />

          <Card
            icon="mdi:bank-transfer-in"
            title="Deposits"
            value={`$${Number(stats.deposits.totalAmount).toLocaleString()}`}
            badges={[
              { text: `Approved: ${stats.deposits.approved}`, color: "green" },
              { text: `Pending: ${stats.deposits.pending}`, color: "yellow" },
              { text: `Rejected: ${stats.deposits.rejected}`, color: "red" },
            ]}
          />

          <Card
            icon="mdi:bank-transfer-out"
            title="Withdrawals"
            value={`$${Number(stats.withdrawals.totalAmount).toLocaleString()}`}
            badges={[
              { text: `Approved: ${stats.withdrawals.approved}`, color: "green" },
              { text: `Pending: ${stats.withdrawals.pending}`, color: "yellow" },
              { text: `Rejected: ${stats.withdrawals.rejected}`, color: "red" },
            ]}
          />

          <Card
            icon="mdi:file-document-outline"
            title="KYC Docs"
            value={stats.kyc.total}
            badges={[
              { text: `Approved: ${stats.kyc.approved}`, color: "green" },
              { text: `Pending: ${stats.kyc.pending}`, color: "yellow" },
              { text: `Rejected: ${stats.kyc.rejected}`, color: "red" },
            ]}
          />

          <Card
            icon="mdi:ticket-outline"
            title="Support Tickets"
            value={stats.tickets.total}
            badges={[
              { text: `Open: ${stats.tickets.open}`, color: "yellow" },
              { text: `Closed: ${stats.tickets.closed}`, color: "green" },
            ]}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AdminDashboard;
