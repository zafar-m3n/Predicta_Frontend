import React from "react";
import bankTransfer from "@/assets/bankTransfer.png";
import Badge from "@/components/ui/Badge";

const apiBaseUrl = import.meta.env.VITE_TRADERSROOM_API_BASEURL;

const DepositMethodsList = ({ methods, onSelect }) => {
  if (!methods || methods.length === 0) {
    return <p className="text-gray-600 dark:text-gray-400">No active deposit methods available.</p>;
  }

  const reversedMethods = [...methods].reverse();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {reversedMethods.map((method) => {
        let logoSrc = "";
        if (method.type === "bank") {
          logoSrc = bankTransfer;
        } else if (method.type === "crypto" && method.DepositMethodCryptoDetail?.logo_path) {
          logoSrc = `${apiBaseUrl}/${method.DepositMethodCryptoDetail.logo_path.replace("\\", "/")}`;
        } else if (method.type === "other" && method.DepositMethodOtherDetail?.logo_path) {
          logoSrc = `${apiBaseUrl}/${method.DepositMethodOtherDetail.logo_path.replace("\\", "/")}`;
        }

        return (
          <div
            key={method.id}
            className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center p-4"
          >
            {logoSrc && (
              <div className="w-20 h-20 mb-3 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 shadow-inner">
                <img src={logoSrc} alt={method.name} className="w-full h-full object-contain bg-white" />
              </div>
            )}

            <h3 className="text-sm text-gray-700 dark:text-gray-300 mb-1">Deposit with {method.name}</h3>

            <Badge
              text={method.type}
              color={method.type === "bank" ? "blue" : method.type === "crypto" ? "yellow" : "gray"}
              size="sm"
              rounded="rounded-full"
            />

            <button
              onClick={() => onSelect(method)}
              className="mt-4 w-full bg-accent text-white py-2 rounded-md font-medium hover:bg-accent/90 transition"
            >
              Deposit
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default DepositMethodsList;
