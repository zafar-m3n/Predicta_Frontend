import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import token from "@/lib/utilities";

const SidebarMenu = ({ menuItems }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    token.removeAuthToken();
    token.removeUserData();
    navigate("/login");
  };

  const isChildActive = (children) => children?.some((child) => location.pathname === child.path);

  return (
    <nav className="mt-6 flex-1 px-3 pb-4 space-y-1 overflow-y-auto">
      {menuItems.map((item, idx) => {
        const isActive = location.pathname === item.path;
        const hasChildren = Array.isArray(item.children);
        const menuKey = item.label.toLowerCase().replace(/\s+/g, "-"); // unique key
        const isMenuOpen = openMenus[menuKey] || isChildActive(item.children);
        const childIsActive = isChildActive(item.children);

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

        if (hasChildren) {
          return (
            <div key={idx}>
              <button
                onClick={() => toggleMenu(menuKey)}
                className={`flex items-center w-full p-2 rounded-lg transition hover:bg-accent/10 focus:outline-none ${
                  childIsActive ? "bg-accent text-white font-semibold shadow" : ""
                }`}
              >
                <Icon icon={item.icon} width={20} className={`mr-3 ${childIsActive ? "text-white" : "text-accent"}`} />
                <span className={`dark:text-gray-200 ${isMenuOpen ? "" : "text-gray-700"}`}>{item.label}</span>
                <Icon
                  icon="mdi:chevron-down"
                  width={18}
                  className={`ml-auto transition-transform dark:text-gray-200 ${
                    isMenuOpen ? "rotate-180" : "text-gray-700"
                  }`}
                />
              </button>

              {isMenuOpen && (
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
          );
        }

        return (
          <Link
            key={idx}
            to={item.path}
            className={`flex items-center p-2 rounded-lg transition ${
              isActive
                ? "bg-accent text-white font-semibold shadow"
                : "text-gray-700 dark:text-gray-200 hover:bg-accent/10"
            }`}
          >
            <Icon icon={item.icon} width={20} className={`mr-3 ${isActive ? "text-white" : "text-accent"}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default SidebarMenu;
