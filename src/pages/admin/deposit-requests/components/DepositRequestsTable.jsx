import React, { useState } from "react";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import { formatDate } from "@/utils/formatDate";

const apiBaseUrl = import.meta.env.VITE_TRADERSROOM_API_BASEURL;

const DepositRequestsTable = ({ requests, onApprove, onReject, currentPage, totalPages, onPageChange }) => {
  const [confirmModal, setConfirmModal] = useState({ open: false, action: null, request: null });
  const [rejectionNote, setRejectionNote] = useState("");
  const [proofModal, setProofModal] = useState({ open: false, proofPath: "" });

  const handleActionClick = (action, request) => {
    setRejectionNote("");
    setConfirmModal({ open: true, action, request });
  };

  const confirmAction = () => {
    if (confirmModal.action === "approve") {
      onApprove(confirmModal.request);
    } else {
      onReject(confirmModal.request, rejectionNote);
    }
    setConfirmModal({ open: false, action: null, request: null });
  };

  const handleViewProof = (proofPath) => {
    setProofModal({ open: true, proofPath });
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "user", label: "User" },
    { key: "method", label: "Method" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created At" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = (request, col) => {
    switch (col.key) {
      case "user":
        return (
          <>
            {request.User?.full_name}
            <br />
            <span className="text-xs text-gray-600 dark:text-gray-400">{request.User?.email}</span>
          </>
        );
      case "method":
        return request.DepositMethod?.name;
      case "amount":
        return `$${request.amount}`;
      case "status":
        return (
          <Badge
            text={request.status}
            color={request.status === "approved" ? "green" : request.status === "rejected" ? "red" : "yellow"}
            size="sm"
          />
        );
      case "createdAt":
        return formatDate(request.createdAt);
      case "actions":
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleViewProof(request.proof_path)}
              className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <Icon icon="mdi:eye" width="18" className="text-gray-800 dark:text-gray-200" />
            </button>
            {request.status === "pending" && (
              <>
                <button
                  onClick={() => handleActionClick("approve", request)}
                  className="inline-flex items-center px-2 py-1 border border-green-300 dark:border-green-600 rounded hover:bg-green-50 dark:hover:bg-green-900 transition text-green-600 dark:text-green-400"
                >
                  <Icon icon="mdi:check" width="18" />
                </button>
                <button
                  onClick={() => handleActionClick("reject", request)}
                  className="inline-flex items-center px-2 py-1 border border-red-300 dark:border-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900 transition text-red-600 dark:text-red-400"
                >
                  <Icon icon="mdi:close" width="18" />
                </button>
              </>
            )}
          </div>
        );
      default:
        return request[col.key];
    }
  };

  return (
    <>
      <Table columns={columns} data={requests} renderCell={renderCell} emptyMessage="No deposit requests found." />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} className="mt-4" />

      <Modal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, action: null, request: null })}
        title={confirmModal.action === "approve" ? "Confirm Approval" : "Confirm Rejection"}
      >
        <div className="space-y-4">
          <p className="text-gray-800 dark:text-gray-200">
            Are you sure you want to <strong>{confirmModal.action === "approve" ? "approve" : "reject"}</strong> this
            deposit request?
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
              src={`${apiBaseUrl}/${proofModal.proofPath}`}
              alt="Proof"
              className="max-w-full max-h-[400px] rounded shadow"
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No proof available.</p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default DepositRequestsTable;
