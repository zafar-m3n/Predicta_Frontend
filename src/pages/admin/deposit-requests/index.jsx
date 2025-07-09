import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import DepositRequestsTable from "./components/DepositRequestsTable";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";

const DepositRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.private.getAllDepositRequests();
      setRequests(res.data.requests);
    } catch (error) {
      console.error(error);
      Notification.error("Failed to fetch deposit requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (request) => {
    try {
      const res = await API.private.approveDepositRequest(request.id);
      Notification.success(res.data.message || "Deposit request approved.");
      fetchRequests();
    } catch (error) {
      console.error(error);
      if (error.response) {
        Notification.error(error.response.data.message || "Failed to approve request.");
      } else {
        Notification.error("Server error.");
      }
    }
  };

  const handleReject = async (request, note) => {
    try {
      const res = await API.private.rejectDepositRequest(request.id, note);
      Notification.success(res.data.message || "Deposit request rejected.");
      fetchRequests();
    } catch (error) {
      console.error(error);
      if (error.response) {
        Notification.error(error.response.data.message || "Failed to reject request.");
      } else {
        Notification.error("Server error.");
      }
    }
  };

  return (
    <DefaultLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Deposit Requests</h1>
      </div>

      {loading ? (
        <div className="text-center text-gray-600 py-10">Loading...</div>
      ) : (
        <DepositRequestsTable requests={requests} onApprove={handleApprove} onReject={handleReject} />
      )}
    </DefaultLayout>
  );
};

export default DepositRequests;
