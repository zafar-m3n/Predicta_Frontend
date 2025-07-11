import React, { useEffect, useState } from "react";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Modal from "@/components/ui/Modal";
import UploadKycDocumentModal from "./UploadKycDocumentModal";

const KycDocumentsTable = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  if (loading) return <div>Loading KYC documents...</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">KYC Documents</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-accent text-white px-4 py-2 rounded font-medium hover:bg-accent/90 transition"
        >
          Upload New
        </button>
      </div>

      {documents.length > 0 ? (
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="py-2 px-3 border-b">Type</th>
              <th className="py-2 px-3 border-b">Status</th>
              <th className="py-2 px-3 border-b">Submitted At</th>
              <th className="py-2 px-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="py-2 px-3 border-b capitalize">{doc.document_type.replace("_", " ")}</td>
                <td className="py-2 px-3 border-b">{doc.status}</td>
                <td className="py-2 px-3 border-b">{new Date(doc.submitted_at).toLocaleDateString()}</td>
                <td className="py-2 px-3 border-b">
                  <a
                    href={`/${doc.document_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Preview
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No KYC documents found.</p>
      )}

      {/* Upload Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload KYC Document">
        <UploadKycDocumentModal onSuccess={fetchDocuments} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default KycDocumentsTable;
