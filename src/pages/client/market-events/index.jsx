import React from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import TradingViewWidget from "@/components/TradingViewWidget";
import Heading from "@/components/ui/Heading";

const MarketEvents = () => {
  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto">
        <Heading>Market Events & Live Charts</Heading>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
          Stay up-to-date with real-time market data, major events, and trends to make informed trading decisions.
        </p>
        <TradingViewWidget />
      </div>
    </DefaultLayout>
  );
};

export default MarketEvents;
