import React, { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import IconComponent from "./IconComponent";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      title="Toggle Theme"
    >
      {theme === "light" ? (
        <IconComponent icon="mdi:weather-night" className="text-gray-800" width={24} />
      ) : (
        <IconComponent icon="mdi:white-balance-sunny" className="text-yellow-400" width={24} />
      )}
    </button>
  );
};

export default ThemeToggle;
