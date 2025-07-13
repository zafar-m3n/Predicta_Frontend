import React from "react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";

const ViewDepositMethodModal = ({ isOpen, onClose, method, details }) => {
  if (!method) return null;

  const apiBaseUrl = import.meta.env.VITE_TRADERSROOM_API_BASEURL;

  const renderField = (label, value) => (
    <div className="flex justify-between py-1">
      <span className="text-gray-500">{label}:</span>
      <span className="text-gray-700 font-medium text-right max-w-[60%] break-words">{value || "-"}</span>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deposit Method Details" size="lg" centered>
      <div className="space-y-6">
        {/* General Info */}
        <div>
          <div className="flex items-center mb-2">
            <Icon icon="mdi:information-outline" width="18" className="text-accent mr-1" />
            <h3 className="text-gray-700 font-semibold">General Info</h3>
          </div>
          <div className="border-t border-gray-200 mt-1 pt-2 space-y-1">
            {renderField("Name", method.name)}
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Type:</span>
              <Badge
                text={method.type}
                color={method.type === "bank" ? "blue" : method.type === "crypto" ? "yellow" : "gray"}
                size="sm"
              />
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Status:</span>
              <Badge text={method.status} color={method.status === "active" ? "green" : "red"} size="sm" />
            </div>
          </div>
        </div>

        {method.type === "bank" && details && (
          <div>
            <div className="flex items-center mb-2">
              <Icon icon="mdi:bank-outline" width="18" className="text-accent mr-1" />
              <h3 className="text-gray-700 font-semibold">Bank Details</h3>
            </div>
            <div className="border-t border-gray-200 mt-1 pt-2 space-y-1">
              {renderField("Beneficiary Name", details.beneficiary_name)}
              {renderField("Bank Name", details.bank_name)}
              {renderField("Branch", details.branch)}
              {renderField("Account Number", details.account_number)}
              {renderField("IFSC Code / Swift Code / Agency", details.ifsc_code)}
            </div>
          </div>
        )}

        {method.type === "crypto" && details && (
          <div>
            <div className="flex items-center mb-2">
              <Icon icon="mdi:currency-btc" width="18" className="text-accent mr-1" />
              <h3 className="text-gray-700 font-semibold">Crypto Details</h3>
            </div>
            <div className="border-t border-gray-200 mt-1 pt-2 space-y-1">
              {renderField("Network", details.network)}
              {renderField("Address", details.address)}
              {(details.qr_code_path || details.logo_path) && (
                <div className="flex flex-wrap gap-6 mt-3">
                  {details.qr_code_path && (
                    <div className="flex flex-col items-center">
                      <img
                        src={`${apiBaseUrl}/${details.qr_code_path}`}
                        alt="QR Code"
                        className="w-28 h-28 object-contain rounded shadow-md"
                      />
                      <p className="text-gray-500 text-xs mt-1">QR Code</p>
                    </div>
                  )}
                  {details.logo_path && (
                    <div className="flex flex-col items-center">
                      <img
                        src={`${apiBaseUrl}/${details.logo_path}`}
                        alt="Logo"
                        className="w-28 h-28 object-contain rounded shadow-md"
                      />
                      <p className="text-gray-500 text-xs mt-1">Logo</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {method.type === "other" && details && (
          <div>
            <div className="flex items-center mb-2">
              <Icon icon="mdi:qrcode-scan" width="18" className="text-accent mr-1" />
              <h3 className="text-gray-700 font-semibold">Other Details</h3>
            </div>
            <div className="border-t border-gray-200 mt-1 pt-2 space-y-1">
              {(details.qr_code_path || details.logo_path) && (
                <div className="flex flex-wrap gap-6 mt-3">
                  {details.qr_code_path && (
                    <div className="flex flex-col items-center">
                      <img
                        src={`${apiBaseUrl}/${details.qr_code_path}`}
                        alt="QR Code"
                        className="w-28 h-28 object-contain rounded shadow-md"
                      />
                      <p className="text-gray-500 text-xs mt-1">QR Code</p>
                    </div>
                  )}
                  {details.logo_path && (
                    <div className="flex flex-col items-center">
                      <img
                        src={`${apiBaseUrl}/${details.logo_path}`}
                        alt="Logo"
                        className="w-28 h-28 object-contain rounded shadow-md"
                      />
                      <p className="text-gray-500 text-xs mt-1">Logo</p>
                    </div>
                  )}
                </div>
              )}
              {renderField("Notes", details.notes)}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ViewDepositMethodModal;
