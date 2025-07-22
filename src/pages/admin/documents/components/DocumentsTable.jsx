import React, { useState } from "react";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import { formatDate } from "@/utils/formatDate";

const apiBaseUrl = import.meta.env.VITE_TRADERSROOM_API_BASEURL;

const DocumentsTable = ({ documents, onApprove, onReject, currentPage, totalPages, onPageChange }) => {
  const [confirmModal, setConfirmModal] = useState({ open: false, action: null, document: null });
  const [rejectionNote, setRejectionNote] = useState("");
  const [previewModal, setPreviewModal] = useState({ open: false, documentPath: "" });

  const getDocumentLabel = (type) => {
    switch (type) {
      case "id_card":
        return "ID Card";
      case "drivers_license":
        return "Driver's License";
      case "utility_bill":
        return "Utility Bill";
      default:
        return type;
    }
  };

  const handleActionClick = (action, document) => {
    setRejectionNote("");
    setConfirmModal({ open: true, action, document });
  };

  const confirmAction = () => {
    if (confirmModal.action === "approve") {
      onApprove(confirmModal.document);
    } else if (confirmModal.action === "reject") {
      onReject(confirmModal.document, rejectionNote);
    }
    setConfirmModal({ open: false, action: null, document: null });
  };

  const handleViewDocument = (path) => {
    setPreviewModal({ open: true, documentPath: path });
  };

  return (
    <>
      <div className="overflow-x-auto rounded shadow hidden md:block">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-white dark:bg-gray-700">
            <tr>
              {["ID", "User", "Document Type", "Status", "Submitted At", "Actions"].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {documents.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-600 dark:text-gray-400">
                  No documents found.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="even:bg-gray-200 even:dark:bg-gray-700 odd:bg-gray-100 odd:dark:bg-gray-800"
                >
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{doc.id}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                    {doc.User?.full_name}
                    <br />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{doc.User?.email}</span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                    {getDocumentLabel(doc.document_type)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                    <Badge
                      text={doc.status}
                      color={doc.status === "approved" ? "green" : doc.status === "rejected" ? "red" : "yellow"}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                    {formatDate(doc.submitted_at)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 space-x-2">
                    <button
                      onClick={() => handleViewDocument(doc.document_path)}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <Icon icon="mdi:eye" width="18" className="text-gray-800 dark:text-gray-200" />
                    </button>
                    {doc.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleActionClick("approve", doc)}
                          className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                          <Icon icon="mdi:check" width="18" className="text-gray-800 dark:text-gray-200" />
                        </button>
                        <button
                          onClick={() => handleActionClick("reject", doc)}
                          className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                          <Icon icon="mdi:close" width="18" className="text-gray-800 dark:text-gray-200" />
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {documents.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded shadow">
            No documents found.
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">#{doc.id}</div>
                <Badge
                  text={doc.status}
                  color={doc.status === "approved" ? "green" : doc.status === "rejected" ? "red" : "yellow"}
                  size="sm"
                />
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-200">
                <strong>User:</strong> {doc.User?.full_name}
                <br />
                <span className="text-xs text-gray-500 dark:text-gray-400">{doc.User?.email}</span>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-200">
                <strong>Type:</strong> {getDocumentLabel(doc.document_type)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Submitted:</strong> {formatDate(doc.submitted_at)}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => handleViewDocument(doc.document_path)}
                  className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm text-black dark:text-gray-200"
                >
                  <Icon icon="mdi:eye" width="18" className="me-1" /> View
                </button>
                {doc.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleActionClick("approve", doc)}
                      className="inline-flex items-center px-2 py-1 border border-green-300 dark:border-green-600 rounded hover:bg-green-50 dark:hover:bg-green-900 transition text-sm text-green-600 dark:text-green-400"
                    >
                      <Icon icon="mdi:check" width="18" className="mr-1" /> Approve
                    </button>
                    <button
                      onClick={() => handleActionClick("reject", doc)}
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

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} className="mt-4" />

      <Modal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, action: null, document: null })}
        title={confirmModal.action === "approve" ? "Confirm Approval" : "Confirm Rejection"}
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-200">
            Are you sure you want to <strong>{confirmModal.action === "approve" ? "approve" : "reject"}</strong> this
            document?
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
              onClick={() => setConfirmModal({ open: false, action: null, document: null })}
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
        isOpen={previewModal.open}
        onClose={() => setPreviewModal({ open: false, documentPath: "" })}
        title="Document Preview"
        size="md"
        centered
      >
        <div className="flex justify-center items-center">
          {previewModal.documentPath ? (
            <img
              src={`${apiBaseUrl}/${previewModal.documentPath}`}
              alt="Document"
              className="max-w-full max-h-[500px] rounded shadow"
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No document preview available.</p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default DocumentsTable;
