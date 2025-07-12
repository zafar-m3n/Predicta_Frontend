import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import DepositMethodsTable from "./components/DepositMethodsTable";
import ViewDepositMethodModal from "./components/ViewDepositMethodModal";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";

const DepositMethods = () => {
  const navigate = useNavigate();

  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async (page = 1) => {
    setLoading(true);
    try {
      const res = await API.private.getAllDepositMethods({ page });
      if (res.status === 200) {
        setMethods(res.data.methods || []);
        setCurrentPage(res.data.page || 1);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to fetch deposit methods.";
      Notification.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchMethods(page);
  };

  const handleCreate = () => {
    navigate("/admin/deposit-methods/new");
  };

  const handleEdit = (method) => {
    navigate(`/admin/deposit-methods/${method.id}/edit`);
  };

  const handleView = async (method) => {
    try {
      const res = await API.private.getDepositMethodById(method.id);
      if (res.status === 200) {
        setSelectedMethod(res.data.method);
        setSelectedDetails(res.data.details);
        setIsModalOpen(true);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to fetch method details.";
      Notification.error(msg);
    }
  };

  const handleToggleStatus = async (method) => {
    try {
      const newStatus = method.status === "active" ? "inactive" : "active";
      const res = await API.private.toggleDepositMethodStatus(method.id, newStatus);

      if (res.status === 200) {
        Notification.success(res.data.message || `Status updated to ${newStatus}.`);
        fetchMethods(currentPage);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update status.";
      Notification.error(msg);
    }
  };

  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Deposit Methods</h1>
        <button
          onClick={handleCreate}
          className="bg-accent text-white px-4 py-2 rounded font-medium hover:bg-accent/90 transition"
        >
          Add New Method
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading deposit methods...</p>
      ) : (
        <DepositMethodsTable
          methods={methods}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onView={handleView}
          onToggleStatus={handleToggleStatus}
        />
      )}

      <ViewDepositMethodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        method={selectedMethod}
        details={selectedDetails}
      />
    </DefaultLayout>
  );
};

export default DepositMethods;
