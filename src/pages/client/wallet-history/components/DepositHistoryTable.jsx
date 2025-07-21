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
      {/* Desktop Table */}
      <div className="overflow-x-auto rounded shadow hidden md:block">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["ID", "Date", "Amount", "Status", "Reference", "Method", "Type", "Admin Note", "Proof"].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {deposits.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                  No deposit history found.
                </td>
              </tr>
            ) : (
              deposits.map((deposit) => (
                <tr
                  key={deposit.id}
                  className="odd:bg-gray-50 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-900"
                >
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{deposit.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(deposit.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                    ${parseFloat(deposit.amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge text={deposit.status} color={statusColor(deposit.status)} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                    {deposit.transaction_reference || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                    {deposit.DepositMethod?.name || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm">
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
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{deposit.admin_note || "N/A"}</td>
                  <td className="px-4 py-3 text-sm">
                    {deposit.proof_path ? (
                      <button
                        onClick={() => handleViewProof(deposit.proof_path)}
                        className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {deposits.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded shadow">
            No deposit history found.
          </div>
        ) : (
          deposits.map((deposit) => (
            <div key={deposit.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">#{deposit.id}</div>
                <Badge text={deposit.status} color={statusColor(deposit.status)} size="sm" />
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Date:</strong> {formatDate(deposit.createdAt)}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Amount:</strong> ${parseFloat(deposit.amount).toFixed(2)}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Reference:</strong> {deposit.transaction_reference || "-"}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Method:</strong> {deposit.DepositMethod?.name || "-"}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Type:</strong>{" "}
                {deposit.DepositMethod?.type ? (
                  <Badge text={deposit.DepositMethod.type} color={typeColor(deposit.DepositMethod.type)} size="sm" />
                ) : (
                  "-"
                )}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Admin Note:</strong> {deposit.admin_note || "N/A"}
              </div>
              <div className="pt-2">
                {deposit.proof_path ? (
                  <button
                    onClick={() => handleViewProof(deposit.proof_path)}
                    className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm text-gray-700 dark:text-gray-200"
                  >
                    <Icon icon="mdi:eye" width="18" className="mr-1" /> View Proof
                  </button>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">No Proof</span>
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
              src={`${apiBaseUrl}/${proofModal.proofPath.replace(/\\\\/g, "/")}`}
              alt="Proof"
              className="max-w-full max-h-[400px] rounded shadow"
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">N/A</p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default DepositHistoryTable;
