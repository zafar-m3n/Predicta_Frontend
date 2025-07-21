import React from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import Icon from "@/components/ui/Icon";

const downloads = [
  {
    id: "windows",
    title: "Windows Desktop App",
    description: "Trade with full charting tools and fast execution on Windows.",
    icon: "mdi:windows",
    color: "text-blue-600",
    link: "/downloads/STPTrade.mt5.terminal.setup.exe",
    button: "Download .exe",
  },
  {
    id: "android",
    title: "Android App",
    description: "Trade on the go with our mobile Meta5Pro app for Android.",
    icon: "mdi:android",
    color: "text-green-600",
    link: "/downloads/meta5pro.apk",
    button: "Download .apk",
  },
  {
    id: "web",
    title: "WebTrader",
    description: "No installation needed — trade directly in your browser.",
    icon: "mdi:web",
    color: "text-indigo-600",
    link: "https://terminal.tradepronet.com/", // ✅ Updated
    button: "Open WebTrader",
  },
];

const Platform = () => {
  return (
    <DefaultLayout>
      <div className="py-5">
        <h1 className="text-2xl font-bold text-secondary mb-2">Download Our Trading Platform</h1>
        <p className="text-gray-600 mb-6">
          Choose the platform that best suits your trading style. Whether you're on desktop, mobile, or browser — we've
          got you covered.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {downloads.map(({ id, title, description, icon, color, link, button }) => (
            <div
              key={id}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <Icon icon={icon} width="48" className={`${color} mb-4`} />
              <h2 className="text-lg font-bold text-secondary mb-2">{title}</h2>
              <p className="text-sm text-gray-600 mb-4">{description}</p>
              <a
                href={link}
                target={id === "web" ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="mt-auto inline-block px-4 py-2 bg-accent text-white font-semibold rounded hover:bg-accent/90 transition"
                download={id !== "web"}
              >
                {button}
              </a>
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Platform;
