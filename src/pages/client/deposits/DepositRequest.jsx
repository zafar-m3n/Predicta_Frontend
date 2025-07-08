import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import DepositRequestForm from "./components/DepositRequestForm";
import DepositMethodDetails from "./components/DepositMethodDetails";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";

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
      const allMethods = res.data.methods || [];

      const selected = allMethods.find((m) => m.id.toString() === methodId);

      if (!selected) {
        Notification.error("Deposit method not found.");
        navigate("/deposits");
        return;
      }

      setMethod(selected);
    } catch (error) {
      Notification.error("Failed to load deposit methods.");
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

      // Check if status is 201 explicitly if needed
      if (res.status === 201) {
        Notification.success(res.data.message || "Deposit request submitted successfully.");
        navigate("/wallet-history");
      } else {
        // Unexpected success code
        Notification.error("Unexpected response from server.");
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          Notification.error(data.message || "Method and amount are required.");
        } else if (status === 404) {
          Notification.error(data.message || "Deposit method not found or inactive.");
          navigate("/deposits");
        } else if (status === 500) {
          Notification.error("Server error. Please try again later.");
        } else {
          Notification.error(data.message || "An error occurred.");
        }
      } else {
        Notification.error("Network or unexpected error.");
      }
      console.error(error);
    }
  };

  return (
    <DefaultLayout>
      {loading ? (
        <p className="text-gray-500">Loading deposit method...</p>
      ) : (
        <>
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
        </>
      )}
    </DefaultLayout>
  );
};

export default DepositRequest;
