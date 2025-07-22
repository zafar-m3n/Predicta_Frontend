import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopbarDesktop from "./components/TopbarDesktop";
import TopbarMobile from "./components/TopbarMobile";

const DefaultLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50 font-dm-sans overflow-hidden relative dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Mobile Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full">
        <TopbarDesktop />
        <TopbarMobile setMenuOpen={setMenuOpen} />
        <main className="mt-10 p-4 md:p-6 overflow-y-auto flex-1">{children}</main>
      </div>
    </div>
  );
};

export default DefaultLayout;
