import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import DepositMethodForm from "./components/DepositMethodForm";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";

const AddOrEditDepositMethod = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("type", data.type);
      formData.append("status", data.status);

      if (data.type === "bank") {
        formData.append("beneficiary_name", data.beneficiary_name || "");
        formData.append("bank_name", data.bank_name || "");
        formData.append("branch", data.branch || "");
        formData.append("account_number", data.account_number || "");
        formData.append("ifsc_code", data.ifsc_code || "");
        formData.append("banco", data.banco || "");
        formData.append("pix", data.pix || "");
      }

      if (data.type === "crypto") {
        formData.append("network", data.network || "");
        formData.append("address", data.address || "");
        if (data.qr_code) formData.append("qr_code", data.qr_code);
        if (data.logo) formData.append("logo", data.logo);
      }

      if (data.type === "other") {
        if (data.qr_code) formData.append("qr_code", data.qr_code);
        if (data.logo) formData.append("logo", data.logo);
        formData.append("notes", data.notes || "");
      }

      await API.private.createDepositMethod(formData);
      Notification.success("Deposit method created successfully.");
      navigate("/admin/deposit-methods");
    } catch (error) {
      Notification.error("Failed to create deposit method.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add Deposit Method</h1>
        <button
          onClick={() => navigate("/admin/deposit-methods")}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-300 transition"
        >
          Back
        </button>
      </div>

      <div className="bg-white shadow rounded p-6">
        <DepositMethodForm initialData={null} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </DefaultLayout>
  );
};

export default AddOrEditDepositMethod;
