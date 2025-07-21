import React, { useState } from "react";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import { formatDate } from "@/utils/formatDate";

const apiBaseUrl = import.meta.env.VITE_TRADERSROOM_API_BASEURL;

const DepositHistoryTable = ({ deposits, currentPage, totalPages, onPageChange }) => {
  const [proofModal, setProofModal] = useState({ open: false, proofPath: "" });

  const handleViewProof = (proofPath) => {
    setProofModal({ open: true, proofPath });
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

  return (
    <>
      <div className="overflow-x-auto rounded shadow hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admin Note
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proof</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {deposits.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-4 py-6 text-center text-gray-500">
                  No deposit history found.
                </td>
              </tr>
            ) : (
              deposits.map((deposit) => (
                <tr key={deposit.id} className="odd:bg-gray-50 even:bg-white">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{deposit.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(deposit.createdAt)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    ${parseFloat(deposit.amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Badge text={deposit.status} color={statusColor(deposit.status)} size="sm" />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {deposit.transaction_reference || "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {deposit.DepositMethod?.name || "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {deposit.DepositMethod?.type ? (
                      <Badge
                        text={deposit.DepositMethod.type}
                        color={typeColor(deposit.DepositMethod.type)}
                        size="sm"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{deposit.admin_note || "N/A"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                    {deposit.proof_path ? (
                      <button
                        onClick={() => handleViewProof(deposit.proof_path)}
                        className="inline-flex items-center px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition"
                      >
                        <Icon icon="mdi:eye" width="18" />
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {deposits.length === 0 ? (
          <div className="p-4 text-center text-gray-500 bg-white rounded shadow">No deposit history found.</div>
        ) : (
          deposits.map((deposit) => (
            <div key={deposit.id} className="bg-white p-4 rounded shadow space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-semibold text-gray-700">#{deposit.id}</div>
                <Badge text={deposit.status} color={statusColor(deposit.status)} size="sm" />
              </div>
              <div className="text-sm text-gray-700">
                <strong>Date:</strong> {formatDate(deposit.createdAt)}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Amount:</strong> ${parseFloat(deposit.amount).toFixed(2)}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Reference:</strong> {deposit.transaction_reference || "-"}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Method:</strong> {deposit.DepositMethod?.name || "-"}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Type:</strong>{" "}
                {deposit.DepositMethod?.type ? (
                  <Badge text={deposit.DepositMethod.type} color={typeColor(deposit.DepositMethod.type)} size="sm" />
                ) : (
                  "-"
                )}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Admin Note:</strong> {deposit.admin_note || "N/A"}
              </div>
              <div className="pt-2">
                {deposit.proof_path ? (
                  <button
                    onClick={() => handleViewProof(deposit.proof_path)}
                    className="inline-flex items-center px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition text-sm"
                  >
                    <Icon icon="mdi:eye" width="18" className="mr-1" /> View Proof
                  </button>
                ) : (
                  <span className="text-sm text-gray-500">No Proof</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} className="mt-4" />
      <Modal
        isOpen={proofModal.open}
        onClose={() => setProofModal({ open: false, proofPath: "" })}
        title="Proof of Deposit"
        size="md"
        centered
      >
        <div className="flex justify-center items-center">
          {proofModal.proofPath ? (
            <img
              src={`${apiBaseUrl}/${proofModal.proofPath.replace(/\\/g, "/")}`}
              alt="Proof"
              className="max-w-full max-h-[400px] rounded shadow"
            />
          ) : (
            <p className="text-gray-500">N/A</p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default DepositHistoryTable;
