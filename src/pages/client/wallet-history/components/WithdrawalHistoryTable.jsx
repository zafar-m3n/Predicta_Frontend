import React, { useState } from "react";
import Table from "@/components/ui/Table";
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

  const columns = [
    { key: "id", label: "ID" },
    { key: "createdAt", label: "Date" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "note", label: "Note" },
    { key: "admin_note", label: "Admin Note" },
    { key: "type", label: "Type" },
    { key: "details", label: "Details" },
  ];

  const renderCell = (w, col) => {
    switch (col.key) {
      case "createdAt":
        return formatDate(w.createdAt);
      case "amount":
        return `$${parseFloat(w.amount).toFixed(2)}`;
      case "status":
        return <Badge text={w.status} color={statusColor(w.status)} size="sm" />;
      case "note":
        return w.note || "N/A";
      case "admin_note":
        return w.admin_note || "N/A";
      case "type":
        return <Badge text={w.WithdrawalMethod?.type || "-"} color={typeColor(w.WithdrawalMethod?.type)} size="sm" />;
      case "details":
        return (
          <button
            onClick={() => handleViewMethod(w.WithdrawalMethod)}
            className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="View Details"
          >
            <Icon icon="mdi:eye" width="18" />
          </button>
        );
      default:
        return w[col.key];
    }
  };

  return (
    <>
      <Table
        columns={columns}
        data={withdrawals}
        renderCell={renderCell}
        emptyMessage="No withdrawal history found."
        className="mb-4"
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />

      <ViewWithdrawalDetailsModal
        isOpen={methodModal.open}
        onClose={() => setMethodModal({ open: false, method: null })}
        method={methodModal.method}
      />
    </>
  );
};

export default WithdrawalHistoryTable;
