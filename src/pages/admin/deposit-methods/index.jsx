import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import DepositMethodsTable from "./components/DepositMethodsTable";
import ViewDepositMethodModal from "./components/ViewDepositMethodModal";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";
import Heading from "@/components/ui/Heading";
import useWidth from "@/hooks/useWidth";

const DepositMethods = () => {
  const navigate = useNavigate();
  const { width, breakpoints } = useWidth();
  const isMobile = width < breakpoints.md;

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
      if (res.status === 200 && res.data.code === "OK") {
        const data = res.data.data;
        setMethods(data.methods || []);
        setCurrentPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
      } else {
        Notification.error(res.data.error || "Failed to fetch deposit methods.");
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to fetch deposit methods.";
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
      if (res.status === 200 && res.data.code === "OK") {
        setSelectedMethod(res.data.data.method);
        setSelectedDetails(res.data.data.details);
        setIsModalOpen(true);
      } else {
        Notification.error(res.data.error || "Failed to fetch method details.");
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to fetch method details.";
      Notification.error(msg);
    }
  };

  const handleToggleStatus = async (method) => {
    try {
      const newStatus = method.status === "active" ? "inactive" : "active";
      const res = await API.private.toggleDepositMethodStatus(method.id, newStatus);

      if (res.status === 200 && res.data.code === "OK") {
        Notification.success(res.data.data.message || `Status updated to ${newStatus}.`);
        fetchMethods(currentPage);
      } else {
        Notification.error(res.data.error || "Failed to update status.");
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to update status.";
      Notification.error(msg);
    }
  };

  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-6">
        <Heading>Deposit Methods</Heading>
        <button
          onClick={handleCreate}
          className="bg-accent text-white px-4 py-2 rounded font-medium hover:bg-accent/90 transition"
        >
          {isMobile ? "+" : "Add New Method"}
        </button>
      </div>

      {loading ? (
        <>
          <Spinner />
          <p className="text-center text-gray-500 mt-4">Loading deposit methods...</p>
        </>
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
