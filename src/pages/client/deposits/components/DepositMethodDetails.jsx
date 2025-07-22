import React from "react";
import Icon from "@/components/ui/Icon";
import Notification from "@/components/ui/Notification";
const apiBaseUrl = import.meta.env.VITE_TRADERSROOM_API_BASEURL;

const Field = ({ label, value }) => (
  <div className="flex flex-col space-y-1 border-b border-dashed py-2">
    <span className="text-gray-500 dark:text-gray-400 text-sm">{label}</span>
    <span className="font-medium text-gray-800 dark:text-white break-words">{value || "-"}</span>
  </div>
);

const DepositMethodDetails = ({ method }) => {
  if (!method) return null;

  let details = null;
  if (method.type === "bank") {
    details = method.DepositMethodBankDetail;
  } else if (method.type === "crypto") {
    details = method.DepositMethodCryptoDetail;
  } else if (method.type === "other") {
    details = method.DepositMethodOtherDetail;
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    Notification.success("Address copied to clipboard.");
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 space-y-5 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <Icon icon="mdi:bank-transfer" className="text-accent" width="22" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Deposit Details</h2>
      </div>

      {method.type === "bank" && details && (
        <div className="space-y-3">
          <Field label="Beneficiary Name" value={details.beneficiary_name} />
          <Field label="Bank Name" value={details.bank_name} />
          <Field label="Branch" value={details.branch} />
          <Field label="Account Number" value={details.account_number} />
          <Field label="IFSC / Swift / Agency" value={details.ifsc_code} />
        </div>
      )}

      {method.type === "crypto" && details && (
        <div className="space-y-3">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Network</p>
            <p className="font-medium text-gray-800 dark:text-white">{details.network || "-"}</p>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Address</p>
            <div className="flex">
              <input
                type="text"
                value={details.address || ""}
                readOnly
                disabled
                className="flex-1 border border-gray-300 dark:border-gray-700 rounded-l px-3 py-2 text-gray-700 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleCopy(details.address)}
                className="px-3 py-2 bg-accent text-white rounded-r font-medium hover:bg-accent/90 transition"
              >
                Copy
              </button>
            </div>
          </div>

          {details.qr_code_path && (
            <div className="flex flex-col items-center mt-4">
              <img
                src={`${apiBaseUrl}/${details.qr_code_path.replace("\\", "/")}`}
                alt="QR Code"
                className="w-40 h-40 object-contain border rounded-lg shadow-md bg-white"
              />
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Scan to copy address</p>
            </div>
          )}
        </div>
      )}

      {method.type === "other" && details && (
        <div className="space-y-3">
          {details.qr_code_path && (
            <div className="flex flex-col items-center">
              <img
                src={`${apiBaseUrl}/${details.qr_code_path.replace("\\", "/")}`}
                alt="QR Code"
                className="w-40 h-40 object-contain border rounded-lg shadow-md mb-2 bg-white"
              />
              <p className="text-gray-500 dark:text-gray-400 text-sm">Scan for details</p>
            </div>
          )}
          <Field label="Notes" value={details.notes} />
        </div>
      )}
    </div>
  );
};

export default DepositMethodDetails;
