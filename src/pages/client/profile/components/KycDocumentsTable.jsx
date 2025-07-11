import React, { useEffect, useState } from "react";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Modal from "@/components/ui/Modal";
import UploadKycDocumentModal from "./UploadKycDocumentModal";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";

const apiBaseUrl = import.meta.env.VITE_TRADERSROOM_API_BASEURL;

const KycDocumentsTable = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewModal, setPreviewModal] = useState({ open: false, documentPath: "" });

  const fetchDocuments = async () => {
    try {
      const res = await API.private.getKycDocuments();
      if (res.status === 200) {
        setDocuments(res.data.documents);
      }
    } catch (error) {
      Notification.error("Failed to fetch KYC documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(
      2,
      "0"
    )} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
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

  if (loading) return <div>Loading KYC documents...</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6 border border-gray-100 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">KYC Documents</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-accent text-white px-4 py-2 rounded font-medium hover:bg-accent/90 transition"
        >
          Upload New
        </button>
      </div>

      <div className="overflow-x-auto rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admin Note
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No KYC documents found.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id} className="odd:bg-gray-50 even:bg-white">
                  <td className="px-4 py-3 whitespace-nowrap">{getDocumentLabel(doc.document_type)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge
                      text={doc.status}
                      color={doc.status === "approved" ? "green" : doc.status === "rejected" ? "red" : "yellow"}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(doc.submitted_at)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {doc.admin_note ? doc.admin_note : "N/A"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => setPreviewModal({ open: true, documentPath: doc.document_path })}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition"
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
            <p className="text-gray-500">No document available.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default KycDocumentsTable;
