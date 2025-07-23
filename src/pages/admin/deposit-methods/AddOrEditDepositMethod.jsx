import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import DepositMethodForm from "./components/DepositMethodForm";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Heading from "@/components/ui/Heading";
import GrayButton from "@/components/ui/GrayButton";

const AddOrEditDepositMethod = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageTitle, setPageTitle] = useState("Add Deposit Method");

  useEffect(() => {
    if (id) {
      setPageTitle("Edit Deposit Method");
      fetchMethod();
    }
  }, [id]);

  const fetchMethod = async () => {
    try {
      const res = await API.private.getDepositMethodById(id);
      if (res.status === 200 && res.data.code === "OK") {
        const { method, details } = res.data.data;
        const combinedData = {
          ...method,
          ...(details || {}),
          qr_code: null,
          logo: null,
        };
        setInitialData(combinedData);
      } else {
        Notification.error(res.data.error || "Failed to fetch deposit method.");
        navigate("/admin/deposit-methods");
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to fetch deposit method.";
      Notification.error(msg);
      navigate("/admin/deposit-methods");
    }
  };

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

      let res;
      if (id) {
        res = await API.private.updateDepositMethod(id, formData);
      } else {
        res = await API.private.createDepositMethod(formData);
      }

      if (
        (id && res.status === 200 && res.data.code === "OK") ||
        (!id && res.status === 201 && res.data.code === "OK")
      ) {
        Notification.success(res.data.data.message || "Deposit method saved successfully.");
        navigate("/admin/deposit-methods");
      } else {
        Notification.error(res.data.error || "Failed to save deposit method.");
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to save deposit method.";
      Notification.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-6">
        <Heading>{pageTitle}</Heading>
        <GrayButton onClick={() => navigate("/admin/deposit-methods")} text="Back" disabled={isSubmitting} />
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded p-6">
        <DepositMethodForm initialData={initialData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </DefaultLayout>
  );
};

export default AddOrEditDepositMethod;
