import React from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import token from "@/lib/utilities";
import Icon from "@/components/ui/Icon";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = token.getUserData();
  const userName = user?.full_name || "User";

  const cards = [
    {
      icon: "mdi:wallet-outline",
      title: "Wallet",
      description: "Check your balance and view wallet details.",
      route: "/wallet-history",
    },
    {
      icon: "mdi:bank-transfer",
      title: "Deposit",
      description: "Add funds easily using various deposit methods.",
      route: "/deposits",
    },
    {
      icon: "mdi:bank-transfer-out",
      title: "Withdraw",
      description: "Withdraw your available funds securely.",
      route: "/withdrawals",
    },
    {
      icon: "mdi:calendar-month-outline",
      title: "Market Events",
      description: "Stay updated with important market news.",
      route: "/market-events",
    },
    {
      icon: "mdi:headset",
      title: "Support",
      description: "Contact support or view your existing tickets.",
      route: "/tickets",
    },
    {
      icon: "mdi:account-outline",
      title: "Profile",
      description: "Manage your personal information and settings.",
      route: "/profile",
    },
  ];

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center justify-center text-center py-5">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">Welcome, {userName}</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mb-10">
          This is your dashboard. From here, you can manage your wallet, transfer funds, view events, and much more. Use
          the cards below to navigate quickly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.route)}
              className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all p-4 flex flex-col items-center justify-between text-center"
            >
              <Icon icon={card.icon} width={40} className="text-accent mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{card.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Dashboard;
