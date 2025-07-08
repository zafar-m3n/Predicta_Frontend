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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const res = await API.private.getAllDepositMethods();
      setMethods(res.data.methods || []);
    } catch (error) {
      Notification.error("Failed to fetch deposit methods.");
    } finally {
      setLoading(false);
    }
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
      setSelectedMethod(res.data.method);
      setSelectedDetails(res.data.details);
      setIsModalOpen(true);
    } catch (error) {
      Notification.error("Failed to fetch method details.");
    }
  };

  const handleToggleStatus = async (method) => {
    try {
      const newStatus = method.status === "active" ? "inactive" : "active";
      await API.private.toggleDepositMethodStatus(method.id, newStatus);
      Notification.success(`Status updated to ${newStatus}.`);
      fetchMethods();
    } catch (error) {
      Notification.error("Failed to update status.");
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
