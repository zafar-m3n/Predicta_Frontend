import React, { useEffect, useState } from "react";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Modal from "@/components/ui/Modal";
import UploadKycDocumentModal from "./UploadKycDocumentModal";
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
    } catch (error) {
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

      <div className="overflow-x-auto rounded">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Admin Note
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {documents.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                  No KYC documents found.
                </td>
              </tr>
            ) : (
              documents.map((doc, index) => (
                <tr
                  key={doc.id}
                  className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/90" : "bg-white dark:bg-gray-900"}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700 dark:text-gray-200">
                    {getDocumentLabel(doc.document_type)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge
                      text={doc.status}
                      color={doc.status === "approved" ? "green" : doc.status === "rejected" ? "red" : "yellow"}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(doc.submitted_at)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {doc.admin_note ? doc.admin_note : "N/A"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => setPreviewModal({ open: true, documentPath: doc.document_path })}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-800 dark:text-gray-100"
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
            <p className="text-gray-500 dark:text-gray-400">No document available.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default KycDocumentsTable;
