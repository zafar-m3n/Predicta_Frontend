import React from "react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";

const ViewWithdrawalDetailsModal = ({ isOpen, onClose, method }) => {
  if (!method) return null;

  const typeColor = (type) => {
    switch (type) {
      case "bank":
        return "blue";
      case "crypto":
        return "yellow";
      default:
        return "gray";
    }
  };

  const renderField = (label, value) => (
    <div className="flex justify-between py-1">
      <span className="text-gray-500">{label}:</span>
      <span className="text-gray-700 font-medium text-right max-w-[60%] break-words">{value || "N/A"}</span>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Withdrawal Details" size="lg" centered>
      <div className="space-y-6">
        {/* Method Info */}
        <div>
          <div className="flex items-center mb-2">
            <Icon icon="mdi:bank-transfer" width="18" className="text-accent mr-1" />
            <h3 className="text-gray-700 font-semibold">Withdrawal Details</h3>
          </div>
          <div className="border-t border-gray-200 mt-1 pt-2 space-y-1">
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Type:</span>
              <Badge text={method.type} color={typeColor(method.type)} size="sm" />
            </div>

            {method.type === "bank" && (
              <>
                {renderField("Bank Name", method.bank_name)}
                {renderField("Branch", method.branch)}
                {renderField("Account Name", method.account_name)}
                {renderField("Account Number", method.account_number)}
                {renderField("SWIFT Code", method.swift_code)}
                {renderField("IBAN", method.iban)}
              </>
            )}

            {method.type === "crypto" && (
              <>
                {renderField("Network", method.network)}
                {renderField("Wallet Address", method.wallet_address)}
              </>
            )}
          </div>
        </div>

        {/* Status Info */}
        <div>
          <div className="flex items-center mb-2">
            <Icon icon="mdi:information-outline" width="18" className="text-accent mr-1" />
            <h3 className="text-gray-700 font-semibold">Status Info</h3>
          </div>
          <div className="border-t border-gray-200 mt-1 pt-2 space-y-1">
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Status:</span>
              <Badge text={method.status} color={method.status === "active" ? "green" : "red"} size="sm" />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewWithdrawalDetailsModal;
