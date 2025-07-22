import React from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Icon from "@/components/ui/Icon";
import logo from "@/assets/logo.png";
import logoWhite from "@/assets/logo-white.png";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";

const TopbarMobile = ({ setMenuOpen }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow fixed top-0 left-0 right-0 z-30">
      <img src={theme === "dark" ? logoWhite : logo} alt="Logo" className="h-8 w-auto" />
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button onClick={() => setMenuOpen(true)}>
          <Icon icon="mdi:menu" width={26} className="text-accent" />
        </button>
      </div>
    </div>
  );
};

export default TopbarMobile;
