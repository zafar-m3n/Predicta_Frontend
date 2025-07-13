import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import DepositRequestForm from "./components/DepositRequestForm";
import DepositMethodDetails from "./components/DepositMethodDetails";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";

const DepositRequest = () => {
  const { methodId } = useParams();
  const navigate = useNavigate();

  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveMethods();
  }, [methodId]);

  const fetchActiveMethods = async () => {
    setLoading(true);
    try {
      const res = await API.private.getActiveDepositMethods();
      if (res.status === 200 && res.data.code === "OK") {
        const allMethods = res.data.data.methods || [];
        const selected = allMethods.find((m) => m.id.toString() === methodId);

        if (!selected) {
          Notification.error("Deposit method not found.");
          navigate("/deposits");
          return;
        }

        setMethod(selected);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to load deposit methods.";
      Notification.error(msg);
      navigate("/deposits");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("method_id", method.id);
      formData.append("amount", data.amount);
      formData.append("transaction_reference", data.transaction_reference);

      if (data.proof) {
        formData.append("proof", data.proof);
      }

      const res = await API.private.createDepositRequest(formData);
      if (res.status === 201 && res.data.code === "OK") {
        Notification.success(res.data.data.message || "Deposit request submitted successfully.");
        navigate("/wallet-history");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to submit deposit request.";
      Notification.error(msg);

      if (error.response?.status === 404) {
        navigate("/deposits");
      }
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
        <p className="text-center text-gray-500 mt-4">Loading deposit details...</p>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{method.name} Deposit</h1>
        <p className="text-gray-600">Fill out the form and upload your payment proof.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <DepositRequestForm onSubmit={handleFormSubmit} isSubmitting={false} method={method} />
        </div>
        <div>
          <DepositMethodDetails method={method} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default DepositRequest;
