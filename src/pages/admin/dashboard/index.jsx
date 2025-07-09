import React from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import Icon from "@/components/ui/Icon";
import token from "@/lib/utilities";

const AdminDashboard = () => {
  // Get admin name
  const user = token.getUserData();
  const userName = user?.full_name || "Admin";

  // Example analytics data (static placeholders)
  const analytics = [
    {
      icon: "mdi:account-group-outline",
      title: "Total Users",
      value: "1,245",
      description: "All active and verified users.",
    },
    {
      icon: "mdi:bank-transfer-in",
      title: "Total Deposits",
      value: "$342,500",
      description: "Cumulative deposit amount.",
    },
    {
      icon: "mdi:bank-transfer-out",
      title: "Total Withdrawals",
      value: "$198,700",
      description: "Cumulative withdrawal amount.",
    },
    {
      icon: "mdi:ticket-outline",
      title: "Open Tickets",
      value: "36",
      description: "Pending support tickets.",
    },
    {
      icon: "mdi:calendar-month-outline",
      title: "Market Events",
      value: "12",
      description: "Upcoming market events.",
    },
    {
      icon: "mdi:cog-outline",
      title: "Settings Updates",
      value: "3",
      description: "New configuration changes.",
    },
  ];

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center text-center py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {userName}</h1>
        <p className="text-gray-600 max-w-2xl mb-10">
          Here is an overview of the system analytics. Monitor user activity, transactions, and other key stats at a
          glance.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {analytics.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex flex-col items-center text-center"
            >
              <Icon icon={item.icon} width={40} className="text-accent mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-2xl font-bold text-accent mb-2">{item.value}</p>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AdminDashboard;
