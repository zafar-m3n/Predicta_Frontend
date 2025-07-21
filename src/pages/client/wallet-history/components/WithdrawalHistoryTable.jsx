import React, { useState } from "react";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import Pagination from "@/components/ui/Pagination";
import { formatDate } from "@/utils/formatDate";
import ViewWithdrawalDetailsModal from "./ViewWithdrawalDetailsModal";

const WithdrawalHistoryTable = ({ withdrawals, currentPage, totalPages, onPageChange }) => {
  const [methodModal, setMethodModal] = useState({ open: false, method: null });

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
      {/* Desktop Table */}
      <div className="overflow-x-auto rounded shadow hidden md:block">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["ID", "Date", "Amount", "Status", "Note", "Admin Note", "Type", "Details"].map((col) => (
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
            {withdrawals.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                  No withdrawal history found.
                </td>
              </tr>
            ) : (
              withdrawals.map((w) => (
                <tr key={w.id} className="odd:bg-gray-50 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-900">
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{w.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{formatDate(w.createdAt)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                    ${parseFloat(w.amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge text={w.status} color={statusColor(w.status)} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{w.note || "N/A"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{w.admin_note || "N/A"}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge
                      text={w.WithdrawalMethod?.type || "-"}
                      color={typeColor(w.WithdrawalMethod?.type)}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleViewMethod(w.WithdrawalMethod)}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {withdrawals.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded shadow">
            No withdrawal history found.
          </div>
        ) : (
          withdrawals.map((w) => (
            <div key={w.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">#{w.id}</div>
                <Badge text={w.status} color={statusColor(w.status)} size="sm" />
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Date:</strong> {formatDate(w.createdAt)}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Amount:</strong> ${parseFloat(w.amount).toFixed(2)}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Note:</strong> {w.note || "N/A"}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Admin Note:</strong> {w.admin_note || "N/A"}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Type:</strong>{" "}
                <Badge text={w.WithdrawalMethod?.type || "-"} color={typeColor(w.WithdrawalMethod?.type)} size="sm" />
              </div>
              <div className="pt-2">
                <button
                  onClick={() => handleViewMethod(w.WithdrawalMethod)}
                  className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm text-gray-700 dark:text-gray-200"
                >
                  <Icon icon="mdi:eye" width="18" className="mr-1" />
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} className="mt-4" />

      <ViewWithdrawalDetailsModal
        isOpen={methodModal.open}
        onClose={() => setMethodModal({ open: false, method: null })}
        method={methodModal.method}
      />
    </>
  );
};

export default WithdrawalHistoryTable;
