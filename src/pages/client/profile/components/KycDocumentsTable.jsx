import React, { useEffect, useState } from "react";
import API from "@/services/index";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import UploadKycDocumentModal from "./UploadKycDocumentModal";
import Notification from "@/components/ui/Notification";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import Spinner from "@/components/ui/Spinner";
import Heading from "@/components/ui/Heading";
import AccentButton from "@/components/ui/AccentButton";
import { formatDate } from "@/utils/formatDate";
import useWidth from "@/hooks/useWidth";

const apiBaseUrl = import.meta.env.VITE_TRADERSROOM_API_BASEURL;

const KycDocumentsTable = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewModal, setPreviewModal] = useState({ open: false, documentPath: "" });

  const { width, breakpoints } = useWidth();
  const isMobile = width < breakpoints.md;

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await API.private.getKycDocuments();
      if (res.status === 200 && res.data.code === "OK") {
        setDocuments(res.data.data.documents);
      }
    } catch {
      Notification.error("Failed to fetch KYC documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

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
    { key: "document_type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "submitted_at", label: "Submitted" },
    { key: "admin_note", label: "Admin Note" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = (doc, col) => {
    switch (col.key) {
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
      case "admin_note":
        return doc.admin_note || "N/A";
      case "actions":
        return (
          <button
            onClick={() => setPreviewModal({ open: true, documentPath: doc.document_path })}
            className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-800 dark:text-gray-100"
            title="Preview"
          >
            <Icon icon="mdi:eye" width="18" />
          </button>
        );
      default:
        return doc[col.key];
    }
  };

  if (loading) {
    return <Spinner message="Loading KYC documents..." />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-100 dark:border-gray-700 w-full">
      <div className="flex justify-between items-center mb-6">
        <Heading>KYC Documents</Heading>
        <div className="w-fit">
          <AccentButton onClick={() => setIsModalOpen(true)} text={isMobile ? "+" : "Upload New"} />
        </div>
      </div>

      <Table
        columns={columns}
        data={documents}
        renderCell={renderCell}
        emptyMessage="No KYC documents found."
        className="mb-4"
      />

      {/* Upload Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload KYC Document">
        <UploadKycDocumentModal onSuccess={fetchDocuments} onClose={() => setIsModalOpen(false)} />
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={previewModal.open}
        onClose={() => setPreviewModal({ open: false, documentPath: "" })}
        title="KYC Document Preview"
        size="md"
        centered
      >
        <div className="flex justify-center items-center">
          {previewModal.documentPath ? (
            <img
              src={`${apiBaseUrl}/${previewModal.documentPath}`}
              alt="KYC Document"
              className="max-w-full max-h-[400px] rounded shadow"
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No document available.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default KycDocumentsTable;
