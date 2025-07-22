import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import ThemeToggle from "@/components/ui/ThemeToggle";
import logo from "@/assets/logo.png";
import logoWhite from "@/assets/logo-white.png";
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
  { label: "Tickets", icon: "mdi:headset", path: "/tickets" },
  { label: "Market Events", icon: "mdi:calendar-month-outline", path: "/market-events" },
  { label: "Platform", icon: "streamline-cyber:multi-platform-2", path: "/platform" },
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
  { label: "Customer Support", icon: "mdi:headset", path: "/admin/support" },
  { label: "Manage Users", icon: "mdi:account-group-outline", path: "/admin/users" },
  { label: "Logout", icon: "mdi:logout", action: "logout" },
];

const DefaultLayout = ({ children }) => {
  const { theme } = useContext(ThemeContext);
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
    <div className="flex h-screen bg-gray-50 font-dm-sans overflow-hidden relative dark:bg-gray-900">
      <div
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:relative md:z-40 md:flex
        flex-col`}
      >
        <div className="flex justify-between items-center p-4 shadow-sm">
          <img src={theme === "dark" ? logoWhite : logo} alt="Logo" className="h-8 w-auto" />
        </div>

        {userRole === "client" && (
          <div className="p-5 bg-gradient-to-r from-accent/20 to-transparent rounded m-4 shadow">
            <p className="text-xs text-gray-500 dark:text-gray-300 uppercase tracking-widest">My Wallet</p>
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
                  className="flex items-center w-full p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-accent/10 transition"
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
                  <span
                    className={`dark:text-gray-200 hover:bg-accent/10 ${
                      transferOpen || activeParent ? "" : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </span>
                  <Icon
                    icon="mdi:chevron-down"
                    width={18}
                    className={`ml-auto transition-transform dark:text-gray-200 hover:bg-accent/10 ${
                      transferOpen || activeParent ? "rotate-180" : "text-gray-700"
                    }`}
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
                            : "text-gray-600 dark:text-gray-300 hover:bg-accent/10"
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
                    : "text-gray-700 dark:text-gray-200 hover:bg-accent/10"
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

      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />
      <div className="flex-1 flex flex-col h-full">
        <div className="hidden md:flex justify-end items-center bg-white dark:bg-gray-800 shadow px-6 fixed top-0 right-0 left-64 z-30 h-16">
          <ThemeToggle />
          <Icon icon="mdi:account-circle" width={34} className="cursor-pointer text-gray-600 dark:text-gray-300 ml-4" />
          <div className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full ml-4 shadow">ENG</div>
        </div>
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow fixed top-0 left-0 right-0 z-30">
          <img src={theme === "dark" ? logoWhite : logo} alt="Logo" className="h-8 w-auto" />

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button onClick={() => setMenuOpen(true)}>
              <Icon icon="mdi:menu" width={26} className="text-accent" />
            </button>
          </div>
        </div>

        <main className="mt-10 p-4 md:p-6 overflow-y-auto flex-1">{children}</main>
      </div>
    </div>
  );
};

export default DefaultLayout;
