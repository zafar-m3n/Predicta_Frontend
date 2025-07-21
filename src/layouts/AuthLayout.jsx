import React, { useContext } from "react";
import logo from "@/assets/logo.png";
import logoWhite from "@/assets/logo-white.png";
import { ThemeContext } from "@/context/ThemeContext";

const AuthLayout = ({ children }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-dm-sans bg-white dark:bg-gray-900 transition-colors duration-300">
      <div
        className={`
          flex items-center justify-center w-full md:w-1/3 py-6 shadow-lg md:shadow-2xl
          bg-gradient-to-br
          ${theme === "dark" ? "from-gray-800 via-accent/20 to-gray-900" : "from-white via-accent/30 to-white"}
        `}
      >
        <img
          src={theme === "dark" ? logoWhite : logo}
          alt="Logo"
          className="h-12 md:h-16 object-contain transition-all duration-300"
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 text-gray-800 dark:text-gray-200">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
