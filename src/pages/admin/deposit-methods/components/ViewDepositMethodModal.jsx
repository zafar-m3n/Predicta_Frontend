import React from "react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";

const ViewDepositMethodModal = ({ isOpen, onClose, method, details }) => {
  if (!method) return null;

  const apiBaseUrl = import.meta.env.VITE_TRADERSROOM_API_BASEURL;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="View Deposit Method" size="lg" centered>
      <div className="space-y-4">
        {/* Basic Info */}
        <div>
          <h3 className="font-semibold">Name:</h3>
          <p>{method.name}</p>
        </div>

        <div className="flex items-center space-x-2">
          <h3 className="font-semibold">Type:</h3>
          <Badge
            text={method.type}
            color={method.type === "bank" ? "blue" : method.type === "crypto" ? "yellow" : "gray"}
            size="sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <h3 className="font-semibold">Status:</h3>
          <Badge text={method.status} color={method.status === "active" ? "green" : "red"} size="sm" />
        </div>

        {/* Type Specific Details */}
        {method.type === "bank" && details && (
          <div className="space-y-2">
            <h3 className="font-semibold">Bank Details:</h3>
            <p>Beneficiary Name: {details.beneficiary_name || "-"}</p>
            <p>Bank Name: {details.bank_name || "-"}</p>
            <p>Branch: {details.branch || "-"}</p>
            <p>Account Number: {details.account_number || "-"}</p>
            <p>IFSC Code: {details.ifsc_code || "-"}</p>
            <p>Banco: {details.banco || "-"}</p>
            <p>Pix: {details.pix || "-"}</p>
          </div>
        )}

        {method.type === "crypto" && details && (
          <div className="space-y-2">
            <h3 className="font-semibold">Crypto Details:</h3>
            <p>Network: {details.network || "-"}</p>
            <p>Address: {details.address || "-"}</p>
            {details.qr_code_path && (
              <div>
                <p>QR Code:</p>
                <img src={`${apiBaseUrl}/${details.qr_code_path}`} alt="QR Code" className="w-32 border rounded" />
              </div>
            )}
            {details.logo_path && (
              <div>
                <p>Logo:</p>
                <img src={`${apiBaseUrl}/${details.logo_path}`} alt="Logo" className="w-32 border rounded" />
              </div>
            )}
          </div>
        )}

        {method.type === "other" && details && (
          <div className="space-y-2">
            <h3 className="font-semibold">Other Details:</h3>
            {details.qr_code_path && (
              <div>
                <p>QR Code:</p>
                <img src={`${apiBaseUrl}/${details.qr_code_path}`} alt="QR Code" className="w-32 border rounded" />
              </div>
            )}
            {details.logo_path && (
              <div>
                <p>Logo:</p>
                <img src={`${apiBaseUrl}/${details.logo_path}`} alt="Logo" className="w-32 border rounded" />
              </div>
            )}
            <p>Notes: {details.notes || "-"}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ViewDepositMethodModal;
