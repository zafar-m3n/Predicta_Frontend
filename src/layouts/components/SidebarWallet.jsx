import React, { useEffect, useState } from "react";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import token from "@/lib/utilities";
import { useNavigate } from "react-router-dom";

const SidebarWallet = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await API.private.getWalletBalance();
        if (res.data.code === "OK") {
          setWalletBalance(res.data.data.balance);
        } else {
          const msg = res.data.error || "Failed to load wallet balance.";
          Notification.error(msg);
        }
      } catch (error) {
        const msg = error.response?.data?.error || "Failed to load wallet balance.";
        Notification.error(msg);

        if (error.response?.status === 401) {
          token.removeAuthToken();
          token.removeUserData();
          navigate("/login");
        }
      }
    };

    fetchBalance();
  }, [navigate]);

  return (
    <div className="p-5 bg-gradient-to-r from-accent/20 to-transparent rounded m-4 shadow">
      <p className="text-xs text-gray-500 dark:text-gray-300 uppercase tracking-widest">My Wallet</p>
      <p className="font-semibold text-xl text-accent mt-1">${parseFloat(walletBalance).toFixed(2)}</p>
    </div>
  );
};

export default SidebarWallet;
