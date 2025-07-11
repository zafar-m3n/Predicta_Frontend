import React, { useState } from "react";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";

const WithdrawalRequestsTable = ({ requests, onApprove, onReject, currentPage, totalPages, onPageChange }) => {
  const [confirmModal, setConfirmModal] = useState({ open: false, action: null, request: null });
  const [rejectionNote, setRejectionNote] = useState("");

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(
      2,
      "0"
    )} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

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

  return (
    <>
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Note
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admin Note
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-4 py-6 text-center text-gray-500">
                  No withdrawal requests found.
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.id} className="odd:bg-gray-50 even:bg-white">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{request.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {request.User?.full_name}
                    <br />
                    <span className="text-gray-500 text-xs">{request.User?.email}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    <Badge
                      text={request.WithdrawalMethod?.type}
                      color={request.WithdrawalMethod?.type === "bank" ? "blue" : "yellow"}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">${request.amount}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {request.note ? request.note : "N/A"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {request.admin_note ? request.admin_note : "N/A"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Badge
                      text={request.status}
                      color={request.status === "approved" ? "green" : request.status === "rejected" ? "red" : "yellow"}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(request.createdAt)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                    {request.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleActionClick("approve", request)}
                          className="inline-flex items-center px-2 py-1 border border-green-300 rounded hover:bg-green-50 transition"
                        >
                          <Icon icon="mdi:check" width="18" />
                        </button>
                        <button
                          onClick={() => handleActionClick("reject", request)}
                          className="inline-flex items-center px-2 py-1 border border-red-300 rounded hover:bg-red-50 transition"
                        >
                          <Icon icon="mdi:close" width="18" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} className="mt-4" />

      {/* Confirm modal */}
      <Modal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, action: null, request: null })}
        title={confirmModal.action === "approve" ? "Confirm Approval" : "Confirm Rejection"}
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to <strong>{confirmModal.action === "approve" ? "approve" : "reject"}</strong> this
            withdrawal request?
          </p>
          {confirmModal.action === "reject" && (
            <textarea
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              placeholder="Enter rejection note (optional)"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent"
            />
          )}
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setConfirmModal({ open: false, action: null, request: null })}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
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
    </>
  );
};

export default WithdrawalRequestsTable;
