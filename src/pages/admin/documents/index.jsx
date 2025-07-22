import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import DocumentsTable from "./components/DocumentsTable";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDocuments(1);
  }, []);

  const fetchDocuments = async (page = 1) => {
    setLoading(true);
    try {
      const res = await API.private.getAllKycDocuments({ page });
      if (res.status === 200 && res.data.code === "OK") {
        setDocuments(res.data.data.documents || []);
        setCurrentPage(res.data.data.page || 1);
        setTotalPages(res.data.data.totalPages || 1);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to fetch KYC documents.";
      Notification.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (document) => {
    try {
      const res = await API.private.approveKycDocument(document.id);
      if (res.status === 200 && res.data.code === "OK") {
        Notification.success(res.data.data.message || "Document approved.");
        fetchDocuments(currentPage);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to approve document.";
      Notification.error(msg);
    }
  };

  const handleReject = async (document, note) => {
    try {
      const res = await API.private.rejectKycDocument(document.id, note);
      if (res.status === 200 && res.data.code === "OK") {
        Notification.success(res.data.data.message || "Document rejected.");
        fetchDocuments(currentPage);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to reject document.";
      Notification.error(msg);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchDocuments(page);
  };

  return (
    <DefaultLayout>
      <div className="py-5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">KYC Documents</h1>
        </div>

        {loading ? (
          <>
            <Spinner />
            <p className="text-center text-gray-500 mt-4">Loading KYC documents...</p>
          </>
        ) : (
          <DocumentsTable
            documents={documents}
            onApprove={handleApprove}
            onReject={handleReject}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </DefaultLayout>
  );
};

export default Documents;
