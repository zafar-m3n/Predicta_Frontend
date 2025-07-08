import React from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import DepositMethodsTable from "./components/DepositMethodsTable";

const DepositMethods = () => {
  const navigate = useNavigate();

  // Mock data for UI display only
  const mockMethods = [
    { id: 1, name: "Bank Transfer", type: "bank", status: "active" },
    { id: 2, name: "USDT Wallet", type: "crypto", status: "inactive" },
    { id: 3, name: "Custom QR", type: "other", status: "active" },
  ];

  const handleCreate = () => {
    navigate("/admin/deposit-methods/new");
  };

  const handleEdit = (method) => {
    navigate(`/admin/deposit-methods/${method.id}/edit`);
  };

  const handleView = (method) => {
    alert(`Clicked view for: ${method.name}`);
  };

  const handleToggleStatus = (method) => {
    alert(`Clicked toggle status for: ${method.name}`);
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

      <DepositMethodsTable
        methods={mockMethods}
        onEdit={handleEdit}
        onView={handleView}
        onToggleStatus={handleToggleStatus}
      />
    </DefaultLayout>
  );
};

export default DepositMethods;
