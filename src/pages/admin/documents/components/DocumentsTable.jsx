import React, { useState } from "react";
import Table from "@/components/ui/Table";
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

  const columns = [
    { key: "id", label: "ID" },
    { key: "user", label: "User" },
    { key: "document_type", label: "Document Type" },
    { key: "status", label: "Status" },
    { key: "submitted_at", label: "Submitted At" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = (doc, col) => {
    switch (col.key) {
      case "user":
        return (
          <div>
            <div>{doc.User?.full_name}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{doc.User?.email}</div>
          </div>
        );
      case "document_type":
        return getDocumentLabel(doc.document_type);
      case "status":
        return (
          <Badge
            text={doc.status}
            color={doc.status === "approved" ? "green" : doc.status === "rejected" ? "red" : "yellow"}
            size="sm"
          />
        );
      case "submitted_at":
        return formatDate(doc.submitted_at);
      case "actions":
        return (
          <div className="flex space-x-2">
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
          </div>
        );
      default:
        return doc[col.key];
    }
  };

  return (
    <>
      <Table
        columns={columns}
        data={documents}
        renderCell={renderCell}
        emptyMessage="No documents found."
        className="mb-4"
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} className="mt-2" />

      {/* Confirm Modal */}
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

      {/* Preview Modal */}
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
