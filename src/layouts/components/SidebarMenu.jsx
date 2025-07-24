import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import token from "@/lib/utilities";

const SidebarMenu = ({ menuItems, transferOpen, setTransferOpen, mt5Open, setMt5Open }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    token.removeAuthToken();
    token.removeUserData();
    navigate("/login");
  };

  const isChildActive = (children) => children?.some((child) => location.pathname === child.path);

  return (
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
          item.children.length === 2 ? (
            <div key={idx}>
              <button
                onClick={() => setTransferOpen(!transferOpen)}
                className={`flex items-center w-full p-2 rounded-lg transition hover:bg-accent/10 focus:outline-none ${
                  activeParent ? "bg-accent text-white font-semibold shadow" : ""
                }`}
              >
                <Icon icon={item.icon} width={20} className={`mr-3 ${activeParent ? "text-white" : "text-accent"}`} />
                <span className={`dark:text-gray-200 ${transferOpen || activeParent ? "" : "text-gray-700"}`}>
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
            <div key={idx}>
              <button
                onClick={() => setMt5Open(!mt5Open)}
                className={`flex items-center w-full p-2 rounded-lg transition hover:bg-accent/10 focus:outline-none ${
                  activeParent ? "bg-accent text-white font-semibold shadow" : ""
                }`}
              >
                <Icon icon={item.icon} width={20} className={`mr-3 ${activeParent ? "text-white" : "text-accent"}`} />
                <span className={`dark:text-gray-200 ${mt5Open || activeParent ? "" : "text-gray-700"}`}>
                  {item.label}
                </span>
                <Icon
                  icon="mdi:chevron-down"
                  width={18}
                  className={`ml-auto transition-transform dark:text-gray-200 hover:bg-accent/10 ${
                    mt5Open || activeParent ? "rotate-180" : "text-gray-700"
                  }`}
                />
              </button>
              {(mt5Open || activeParent) && (
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
          )
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
  );
};

export default SidebarMenu;
