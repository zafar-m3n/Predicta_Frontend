import React from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import TradingViewWidget from "@/components/TradingViewWidget";

const MarketEvents = () => {
  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto py-5">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Market Events & Live Charts</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-10">
          Stay up-to-date with real-time market data, major events, and trends to make informed trading decisions.
        </p>
        <TradingViewWidget />
      </div>
    </DefaultLayout>
  );
};

export default MarketEvents;
