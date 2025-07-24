import React, { useState } from "react";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import ViewWithdrawalRequestModal from "./ViewWithdrawalRequestModal";
import { formatDate } from "@/utils/formatDate";

const WithdrawalRequestsTable = ({ requests, onApprove, onReject, currentPage, totalPages, onPageChange }) => {
  const [confirmModal, setConfirmModal] = useState({ open: false, action: null, request: null });
  const [rejectionNote, setRejectionNote] = useState("");
  const [viewModal, setViewModal] = useState({ open: false, request: null });

  const handleActionClick = (action, request) => {
    setRejectionNote("");
    setConfirmModal({ open: true, action, request });
  };

  const confirmAction = () => {
    if (confirmModal.action === "approve") {
      onApprove(confirmModal.request);
    } else if (confirmModal.action === "reject") {
      onReject(confirmModal.request, rejectionNote);
    }
    setConfirmModal({ open: false, action: null, request: null });
  };

  const handleViewClick = (request) => {
    setViewModal({ open: true, request });
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "user", label: "User" },
    { key: "method", label: "Method" },
    { key: "amount", label: "Amount" },
    { key: "note", label: "User Note" },
    { key: "admin_note", label: "Admin Note" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created At" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = (row, col) => {
    switch (col.key) {
      case "user":
        return (
          <>
            {row.User?.full_name}
            <br />
            <span className="text-xs text-gray-600 dark:text-gray-400">{row.User?.email}</span>
          </>
        );
      case "method":
        return (
          <Badge
            text={row.WithdrawalMethod?.type}
            color={row.WithdrawalMethod?.type === "bank" ? "blue" : "yellow"}
            size="sm"
          />
        );
      case "amount":
        return `$${row.amount}`;
      case "note":
        return row.note || "N/A";
      case "admin_note":
        return row.admin_note || "N/A";
      case "status":
        return (
          <Badge
            text={row.status}
            color={row.status === "approved" ? "green" : row.status === "rejected" ? "red" : "yellow"}
            size="sm"
          />
        );
      case "createdAt":
        return formatDate(row.createdAt);
      case "actions":
        return (
          <div className="space-x-2 flex flex-wrap justify-end">
            <button
              onClick={() => handleViewClick(row)}
              className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <Icon icon="mdi:eye" width="18" className="text-gray-800 dark:text-gray-200" />
            </button>
            {row.status === "pending" && (
              <>
                <button
                  onClick={() => handleActionClick("approve", row)}
                  className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <Icon icon="mdi:check" width="18" className="text-gray-800 dark:text-gray-200" />
                </button>
                <button
                  onClick={() => handleActionClick("reject", row)}
                  className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <Icon icon="mdi:close" width="18" className="text-gray-800 dark:text-gray-200" />
                </button>
              </>
            )}
          </div>
        );
      default:
        return row[col.key];
    }
  };

  return (
    <>
      <Table
        columns={columns}
        data={requests}
        renderCell={renderCell}
        emptyMessage="No withdrawal requests found."
        className="mb-4"
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />

      <Modal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, action: null, request: null })}
        title={confirmModal.action === "approve" ? "Confirm Approval" : "Confirm Rejection"}
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-200">
            Are you sure you want to <strong>{confirmModal.action}</strong> this withdrawal request?
          </p>
          {confirmModal.action === "reject" && (
            <textarea
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              placeholder="Enter rejection note (optional)"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
            />
          )}
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setConfirmModal({ open: false, action: null, request: null })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={confirmAction}
              className="px-4 py-2 bg-accent text-white rounded font-medium hover:bg-accent/90 transition"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      <ViewWithdrawalRequestModal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, request: null })}
        request={viewModal.request}
      />
    </>
  );
};

export default WithdrawalRequestsTable;
