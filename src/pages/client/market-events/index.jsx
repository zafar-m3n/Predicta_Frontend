import React from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import TradingViewWidget from "@/components/TradingViewWidget";

const MarketEvents = () => {
  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">Market Events & Live Charts</h1>
        <p className="text-gray-600 mb-6">
          Stay up-to-date with real-time market data, major events, and trends to make informed trading decisions.
        </p>
        <TradingViewWidget />
      </div>
    </DefaultLayout>
  );
};

export default MarketEvents;
