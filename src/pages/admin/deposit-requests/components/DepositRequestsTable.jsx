import React, { useState } from "react";
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
    } else if (confirmModal.action === "reject") {
      onReject(confirmModal.request, rejectionNote);
    }
    setConfirmModal({ open: false, action: null, request: null });
  };

  const handleViewProof = (proofPath) => {
    setProofModal({ open: true, proofPath });
  };

  return (
    <>
      {/* Desktop table */}
      <div className="overflow-x-auto rounded shadow hidden md:block">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {["ID", "User", "Method", "Amount", "Status", "Created At", "Actions"].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {requests.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                  No deposit requests found.
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr
                  key={request.id}
                  className="odd:bg-gray-50 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-700"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{request.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                    {request.User?.full_name}
                    <br />
                    <span className="text-gray-500 dark:text-gray-400 text-xs">{request.User?.email}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                    {request.DepositMethod?.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                    ${request.amount}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Badge
                      text={request.status}
                      color={request.status === "approved" ? "green" : request.status === "rejected" ? "red" : "yellow"}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(request.createdAt)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleViewProof(request.proof_path)}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <Icon icon="mdi:eye" width="18" className="text-black dark:text-white" />
                    </button>
                    {request.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleActionClick("approve", request)}
                          className="inline-flex items-center px-2 py-1 border border-green-300 dark:border-green-600 rounded hover:bg-green-50 dark:hover:bg-green-900 transition"
                        >
                          <Icon icon="mdi:check" width="18" />
                        </button>
                        <button
                          onClick={() => handleActionClick("reject", request)}
                          className="inline-flex items-center px-2 py-1 border border-red-300 dark:border-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900 transition"
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

      {/* Mobile card layout */}
      <div className="md:hidden space-y-4">
        {requests.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded shadow">
            No deposit requests found.
          </div>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">#{request.id}</div>
                <Badge
                  text={request.status}
                  color={request.status === "approved" ? "green" : request.status === "rejected" ? "red" : "yellow"}
                  size="sm"
                />
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-200">
                <strong>User:</strong> {request.User?.full_name}
                <br />
                <span className="text-gray-500 dark:text-gray-400 text-xs">{request.User?.email}</span>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-200">
                <strong>Method:</strong> {request.DepositMethod?.name}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-200">
                <strong>Amount:</strong> ${request.amount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Created:</strong> {formatDate(request.createdAt)}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => handleViewProof(request.proof_path)}
                  className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm text-black dark:text-gray-200"
                >
                  <Icon icon="mdi:eye" width="18" className="mr-1" /> View Proof
                </button>
                {request.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleActionClick("approve", request)}
                      className="inline-flex items-center px-2 py-1 border border-green-300 dark:border-green-600 rounded hover:bg-green-50 dark:hover:bg-green-900 transition text-sm text-green-600 dark:text-green-400"
                    >
                      <Icon icon="mdi:check" width="18" className="mr-1" /> Approve
                    </button>
                    <button
                      onClick={() => handleActionClick("reject", request)}
                      className="inline-flex items-center px-2 py-1 border border-red-300 dark:border-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900 transition text-sm text-red-600 dark:text-red-400"
                    >
                      <Icon icon="mdi:close" width="18" className="mr-1" /> Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
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
          <p className="text-gray-700 dark:text-gray-200">
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

      {/* Proof modal */}
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
