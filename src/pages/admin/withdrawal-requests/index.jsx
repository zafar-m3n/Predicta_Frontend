import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import WithdrawalRequestsTable from "./components/WithdrawalRequestsTable";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";

const WithdrawalRequests = () => {
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
      const res = await API.private.getAllWithdrawalRequests(page);
      if (res.status === 200 && res.data.code === "OK") {
        const data = res.data.data;
        setRequests(data.requests || []);
        setCurrentPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
      } else {
        Notification.error(res.data.error || "Failed to fetch withdrawal requests.");
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to fetch withdrawal requests.";
      Notification.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request) => {
    try {
      const res = await API.private.approveWithdrawalRequest(request.id);
      if (res.status === 200 && res.data.code === "OK") {
        Notification.success(res.data.data?.message || "Withdrawal request approved.");
        fetchRequests(currentPage);
      } else {
        Notification.error(res.data.error || "Failed to approve request.");
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to approve request.";
      Notification.error(msg);
    }
  };

  const handleReject = async (request, note) => {
    try {
      const res = await API.private.rejectWithdrawalRequest(request.id, note);
      if (res.status === 200 && res.data.code === "OK") {
        Notification.success(res.data.data?.message || "Withdrawal request rejected.");
        fetchRequests(currentPage);
      } else {
        Notification.error(res.data.error || "Failed to reject request.");
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to reject request.";
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
        <h1 className="text-2xl font-semibold text-gray-800">Withdrawal Requests</h1>
      </div>

      {loading ? (
        <>
          <Spinner />
          <p className="text-center text-gray-500 mt-4">Loading withdrawal requests...</p>
        </>
      ) : (
        <WithdrawalRequestsTable
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

export default WithdrawalRequests;
