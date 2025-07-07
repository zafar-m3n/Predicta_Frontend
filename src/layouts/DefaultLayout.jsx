import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import logo from "@/assets/logo.png";
import token from "@/lib/utilities";

// Menu for clients
const clientMenu = [
  { label: "Dashboard", icon: "mdi:view-dashboard-outline", path: "/dashboard" },
  {
    label: "Transfer",
    icon: "mdi:swap-horizontal",
    children: [
      { label: "Deposit Option", path: "/deposits" },
      { label: "Withdrawal", path: "/withdrawal" },
    ],
  },
  { label: "Wallet History", icon: "mdi:wallet-outline", path: "/wallet-history" },
  { label: "Tickets", icon: "mdi:headset", path: "/tickets" },
  { label: "Market Events", icon: "mdi:calendar-month-outline", path: "/market-events" },
  { label: "Demo Accounts", icon: "mdi:account-multiple-outline", path: "/demo-accounts" },
  { label: "Profile", icon: "mdi:account-outline", path: "/profile" },
];

// Menu for admins
const adminMenu = [
  { label: "Dashboard", icon: "mdi:view-dashboard-outline", path: "/admin/dashboard" },
  { label: "Deposit Methods", icon: "mdi:bank-transfer", path: "/admin/deposit-methods" },
  { label: "Withdrawal Requests", icon: "mdi:bank-transfer-out", path: "/admin/withdrawal-requests" },
  { label: "Manage Users", icon: "mdi:account-group-outline", path: "/admin/users" },
  { label: "Settings", icon: "mdi:cog-outline", path: "/admin/settings" },
];

const DefaultLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const location = useLocation();

  const user = token.getUserData();
  const userRole = user?.role || "client";

  // Choose correct menu
  const menuItems = userRole === "admin" ? adminMenu : clientMenu;

  // Check if Transfer submenu should be open by default
  useEffect(() => {
    if (
      userRole === "client" &&
      (location.pathname.includes("/deposits") || location.pathname.includes("/withdrawal"))
    ) {
      setTransferOpen(true);
    }
  }, [location.pathname, userRole]);

  // Check if any child is active
  const isChildActive = (children) => {
    return children?.some((child) => location.pathname === child.path);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-dm-sans">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white shadow-xl">
        <div className="h-20 flex justify-center items-center shadow-sm">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </div>

        {/* Wallet block only for client */}
        {userRole === "client" && (
          <div className="p-5 bg-gradient-to-r from-accent/20 to-transparent rounded m-4 shadow">
            <p className="text-xs text-gray-500 uppercase tracking-widest">My Wallet</p>
            <p className="font-semibold text-xl text-accent mt-1">$ 0.000</p>
          </div>
        )}

        <nav className="flex-1 px-3 pb-4 space-y-1 overflow-y-auto">
          {menuItems.map((item, idx) => {
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

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="hidden md:flex justify-end items-center bg-white shadow px-6" style={{ height: "80px" }}>
          <Icon icon="mdi:account-circle" width={34} className="cursor-pointer text-gray-600" />
          <div className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full ml-4 shadow">ENG</div>
        </div>

        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white shadow">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <Icon icon="mdi:menu" width={26} className="text-accent" />
          </button>
        </div>

        {/* Page content */}
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default DefaultLayout;
