import React from "react";
const apiBaseUrl = import.meta.env.VITE_TRADERSROOM_API_BASEURL;

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

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Deposit Details</h2>

      {method.type === "bank" && details && (
        <div className="space-y-2">
          <p>
            <strong>Beneficiary Name:</strong> {details.beneficiary_name || "-"}
          </p>
          <p>
            <strong>Bank Name:</strong> {details.bank_name || "-"}
          </p>
          <p>
            <strong>Branch:</strong> {details.branch || "-"}
          </p>
          <p>
            <strong>Account Number:</strong> {details.account_number || "-"}
          </p>
          <p>
            <strong>IFSC / Swift / Agency:</strong> {details.ifsc_code || "-"}
          </p>
        </div>
      )}

      {method.type === "crypto" && details && (
        <div className="space-y-2">
          <p>
            <strong>Network:</strong> {details.network || "-"}
          </p>
          <p>
            <strong>Address:</strong> {details.address || "-"}
          </p>
          {details.qr_code_path && (
            <div className="mt-2">
              <img
                src={`${apiBaseUrl}/${details.qr_code_path.replace("\\", "/")}`}
                alt="QR Code"
                className="w-32 h-32 object-contain border rounded"
              />
            </div>
          )}
        </div>
      )}

      {method.type === "other" && details && (
        <div className="space-y-2">
          {details.qr_code_path && (
            <div>
              <img
                src={`${apiBaseUrl}/${details.qr_code_path.replace("\\", "/")}`}
                alt="QR Code"
                className="w-32 h-32 object-contain border rounded mb-2"
              />
            </div>
          )}
          <p>
            <strong>Notes:</strong> {details.notes || "-"}
          </p>
        </div>
      )}
    </div>
  );
};

export default DepositMethodDetails;
