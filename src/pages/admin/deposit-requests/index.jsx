import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import DepositRequestsTable from "./components/DepositRequestsTable";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";

const DepositRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRequests(1);
  }, []);

  const fetchRequests = async (page = 1) => {
    setLoading(true);
    try {
      const res = await API.private.getAllDepositRequests(page);
      if (res.status === 200) {
        setRequests(res.data.requests || []);
        setCurrentPage(res.data.page || 1);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to fetch deposit requests.";
      Notification.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request) => {
    try {
      const res = await API.private.approveDepositRequest(request.id);
      if (res.status === 200) {
        Notification.success(res.data.message || "Deposit request approved.");
        fetchRequests(currentPage);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to approve request.";
      Notification.error(msg);
    }
  };

  const handleReject = async (request, note) => {
    try {
      const res = await API.private.rejectDepositRequest(request.id, note);
      if (res.status === 200) {
        Notification.success(res.data.message || "Deposit request rejected.");
        fetchRequests(currentPage);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to reject request.";
      Notification.error(msg);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchRequests(page);
  };

  return (
    <DefaultLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Deposit Requests</h1>
      </div>

      {loading ? (
        <div className="text-center text-gray-600 py-10">Loading...</div>
      ) : (
        <DepositRequestsTable
          requests={requests}
          onApprove={handleApprove}
          onReject={handleReject}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </DefaultLayout>
  );
};

export default DepositRequests;
