import React, { useState } from "react";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";

const WithdrawalHistoryTable = ({ withdrawals, currentPage, totalPages, onPageChange }) => {
  const [methodModal, setMethodModal] = useState({ open: false, method: null });

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(
      2,
      "0"
    )} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const statusColor = (status) => {
    switch (status) {
      case "approved":
        return "green";
      case "pending":
        return "yellow";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  };

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

  const handleViewMethod = (method) => {
    setMethodModal({ open: true, method });
  };

  return (
    <>
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admin Note
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {withdrawals.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                  No withdrawal history found.
                </td>
              </tr>
            ) : (
              withdrawals.map((w) => (
                <tr key={w.id} className="odd:bg-gray-50 even:bg-white">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{w.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(w.createdAt)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    ${parseFloat(w.amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Badge text={w.status} color={statusColor(w.status)} size="sm" />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{w.note || "N/A"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{w.admin_note || "N/A"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Badge
                      text={w.WithdrawalMethod?.type || "-"}
                      color={typeColor(w.WithdrawalMethod?.type)}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleViewMethod(w.WithdrawalMethod)}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition"
                    >
                      <Icon icon="mdi:eye" width="18" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} className="mt-4" />

      {/* Method Details Modal */}
      <Modal
        isOpen={methodModal.open}
        onClose={() => setMethodModal({ open: false, method: null })}
        title="Withdrawal Method Details"
        size="lg"
        centered
      >
        {methodModal.method ? (
          <div className="space-y-4">
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Type:</span>
              <Badge text={methodModal.method.type} color={typeColor(methodModal.method.type)} size="sm" />
            </div>

            {methodModal.method.type === "bank" && (
              <>
                <div className="border-t border-gray-200 pt-2 space-y-1">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Bank Name:</span>
                    <span className="text-gray-700 font-medium">{methodModal.method.bank_name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Branch:</span>
                    <span className="text-gray-700 font-medium">{methodModal.method.branch || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Account Name:</span>
                    <span className="text-gray-700 font-medium">{methodModal.method.account_name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Account Number:</span>
                    <span className="text-gray-700 font-medium">{methodModal.method.account_number || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">SWIFT Code:</span>
                    <span className="text-gray-700 font-medium">{methodModal.method.swift_code || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">IBAN:</span>
                    <span className="text-gray-700 font-medium">{methodModal.method.iban || "N/A"}</span>
                  </div>
                </div>
              </>
            )}

            {methodModal.method.type === "crypto" && (
              <>
                <div className="border-t border-gray-200 pt-2 space-y-1">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Network:</span>
                    <span className="text-gray-700 font-medium">{methodModal.method.network || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Wallet Address:</span>
                    <span className="text-gray-700 font-medium break-words max-w-[60%]">
                      {methodModal.method.wallet_address || "N/A"}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No method details available.</p>
        )}
      </Modal>
    </>
  );
};

export default WithdrawalHistoryTable;
