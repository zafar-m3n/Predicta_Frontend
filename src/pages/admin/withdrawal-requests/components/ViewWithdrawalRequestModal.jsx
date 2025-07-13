import React from "react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import { formatDate } from "@/utils/formatDate";

const ViewWithdrawalRequestModal = ({ isOpen, onClose, request }) => {
  if (!request) return null;

  const { User, WithdrawalMethod } = request;

  const renderField = (label, value) => (
    <div className="flex justify-between py-1">
      <span className="text-gray-500">{label}:</span>
      <span className="text-gray-700 font-medium text-right max-w-[60%] break-words">{value || "-"}</span>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Withdrawal Request Details" size="lg" centered>
      <div className="space-y-6">
        {/* General Info */}
        <div>
          <div className="flex items-center mb-2">
            <Icon icon="mdi:information-outline" width="18" className="text-accent mr-1" />
            <h3 className="text-gray-700 font-semibold">General Info</h3>
          </div>
          <div className="border-t border-gray-200 mt-1 pt-2 space-y-1">
            {renderField("Amount", `$${request.amount}`)}
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Status:</span>
              <Badge
                text={request.status}
                color={request.status === "approved" ? "green" : request.status === "rejected" ? "red" : "yellow"}
                size="sm"
              />
            </div>
            {renderField("User Note", request.note)}
          </div>
        </div>

        {/* Withdrawal Method Info */}
        <div>
          <div className="flex items-center mb-2">
            <Icon icon="mdi:bank-transfer" width="18" className="text-accent mr-1" />
            <h3 className="text-gray-700 font-semibold">Withdrawal Details</h3>
          </div>
          <div className="border-t border-gray-200 mt-1 pt-2 space-y-1">
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Type:</span>
              <Badge
                text={WithdrawalMethod?.type}
                color={WithdrawalMethod?.type === "bank" ? "blue" : "yellow"}
                size="sm"
              />
            </div>
            {WithdrawalMethod?.type === "bank" && (
              <>
                {renderField("Bank Name", WithdrawalMethod.bank_name)}
                {renderField("Branch", WithdrawalMethod.branch)}
                {renderField("Account Name", WithdrawalMethod.account_name)}
                {renderField("Account Number", WithdrawalMethod.account_number)}
                {renderField("SWIFT Code", WithdrawalMethod.swift_code)}
                {renderField("IBAN", WithdrawalMethod.iban)}
              </>
            )}
            {WithdrawalMethod?.type !== "bank" && (
              <>
                {renderField("Network", WithdrawalMethod.network)}
                {renderField("Wallet Address", WithdrawalMethod.wallet_address)}
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewWithdrawalRequestModal;
