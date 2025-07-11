import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import logo from "@/assets/logo.png";
import token from "@/lib/utilities";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";

// Client menu
const clientMenu = [
  { label: "Dashboard", icon: "mdi:view-dashboard-outline", path: "/dashboard" },
  {
    label: "Transfer",
    icon: "mdi:swap-horizontal",
    children: [
      { label: "Deposit Option", path: "/deposits" },
      { label: "Withdrawal", path: "/withdrawals" },
    ],
  },
  { label: "Wallet History", icon: "mdi:wallet-outline", path: "/wallet-history" },
  // { label: "Tickets", icon: "mdi:headset", path: "/tickets" },
  { label: "Market Events", icon: "mdi:calendar-month-outline", path: "/market-events" },
  { label: "Profile", icon: "mdi:account-outline", path: "/profile" },
  { label: "Logout", icon: "mdi:logout", action: "logout" },
];

// Admin menu
const adminMenu = [
  { label: "Dashboard", icon: "mdi:view-dashboard-outline", path: "/admin/dashboard" },
  { label: "Documents", icon: "mdi:account-check-outline", path: "/admin/documents" },
  { label: "Deposit Methods", icon: "mdi:bank-transfer", path: "/admin/deposit-methods" },
  { label: "Deposit Requests", icon: "mdi:bank-transfer-in", path: "/admin/deposit-requests" },
  { label: "Withdrawal Requests", icon: "mdi:bank-transfer-out", path: "/admin/withdrawal-requests" },
  // { label: "Manage Users", icon: "mdi:account-group-outline", path: "/admin/users" },
  // { label: "Settings", icon: "mdi:cog-outline", path: "/admin/settings" },
  { label: "Logout", icon: "mdi:logout", action: "logout" },
];

const DefaultLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const user = token.getUserData();
  const userRole = user?.role || "client";
  const menuItems = userRole === "admin" ? adminMenu : clientMenu;

  useEffect(() => {
    if (
      userRole === "client" &&
      (location.pathname.includes("/deposits") || location.pathname.includes("/withdrawal"))
    ) {
      setTransferOpen(true);
    }
  }, [location.pathname, userRole]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await API.private.getWalletBalance();
        if (res.status === 200) {
          setWalletBalance(res.data.balance);
        }
      } catch (error) {
        const msg = error.response?.data?.message || "Failed to load wallet balance.";
        Notification.error(msg);

        if (error.response?.status === 401) {
          token.removeAuthToken();
          token.removeUserData();
          navigate("/login");
        }
      }
    };

    if (userRole === "client") {
      fetchBalance();
    }
  }, [userRole, navigate]);

  const isChildActive = (children) => children?.some((child) => location.pathname === child.path);

  const handleLogout = () => {
    token.removeAuthToken();
    token.removeUserData();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 font-dm-sans overflow-hidden">
      <div className="hidden md:flex flex-col w-64 bg-white shadow-xl fixed left-0 top-0 bottom-0 z-40">
        <div className="h-20 flex justify-center items-center shadow-sm">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </div>

        {userRole === "client" && (
          <div className="p-5 bg-gradient-to-r from-accent/20 to-transparent rounded m-4 shadow">
            <p className="text-xs text-gray-500 uppercase tracking-widest">My Wallet</p>
            <p className="font-semibold text-xl text-accent mt-1">${parseFloat(walletBalance).toFixed(2)}</p>
          </div>
        )}

        <nav className="mt-6 flex-1 px-3 pb-4 space-y-1 overflow-y-auto">
          {menuItems.map((item, idx) => {
            if (item.action === "logout") {
              return (
                <button
                  key={idx}
                  onClick={handleLogout}
                  className="flex items-center w-full p-2 rounded-lg text-gray-700 hover:bg-accent/10 transition"
                >
                  <Icon icon={item.icon} width={20} className="mr-3 text-accent" />
                  <span>{item.label}</span>
                </button>
              );
            }

            const activeParent = isChildActive(item.children);

            return item.children ? (
              <div key={idx}>
                <button
                  onClick={() => setTransferOpen(!transferOpen)}
                  className={`flex items-center w-full p-2 rounded-lg transition hover:bg-accent/10 focus:outline-none ${
                    activeParent ? "bg-accent text-white font-semibold shadow" : ""
                  }`}
                >
                  <Icon icon={item.icon} width={20} className={`mr-3 ${activeParent ? "text-white" : "text-accent"}`} />
                  <span>{item.label}</span>
                  <Icon
                    icon="mdi:chevron-down"
                    width={18}
                    className={`ml-auto transition-transform ${transferOpen || activeParent ? "rotate-180" : ""}`}
                  />
                </button>
                {(transferOpen || activeParent) && (
                  <div className="ml-7 mt-1 space-y-1">
                    {item.children.map((child, cIdx) => (
                      <Link
                        key={cIdx}
                        to={child.path}
                        className={`block py-2 px-3 rounded-lg transition ${
                          location.pathname === child.path
                            ? "bg-accent text-white font-semibold shadow"
                            : "text-gray-600 hover:bg-accent/10"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center p-2 rounded-lg transition ${
                  location.pathname === item.path
                    ? "bg-accent text-white font-semibold shadow"
                    : "text-gray-700 hover:bg-accent/10"
                }`}
              >
                <Icon
                  icon={item.icon}
                  width={20}
                  className={`mr-3 ${location.pathname === item.path ? "text-white" : "text-accent"}`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 flex flex-col md:ml-64 h-full">
        <div
          className="hidden md:flex justify-end items-center bg-white shadow px-6 fixed top-0 right-0 left-64 z-30"
          style={{ height: "80px" }}
        >
          <Icon icon="mdi:account-circle" width={34} className="cursor-pointer text-gray-600" />
          <div className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full ml-4 shadow">ENG</div>
        </div>

        <div className="md:hidden flex items-center justify-between p-4 bg-white shadow fixed top-0 left-0 right-0 z-30">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <Icon icon="mdi:menu" width={26} className="text-accent" />
          </button>
        </div>
        <main className="mt-[80px] p-6 overflow-y-auto flex-1">{children}</main>
      </div>
    </div>
  );
};

export default DefaultLayout;
