import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import WithdrawalRequestForm from "./components/WithdrawalRequestForm";
import { useNavigate } from "react-router-dom";

const ClientWithdrawals = () => {
  const [methods, setMethods] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEligibility();
  }, []);

  const fetchEligibility = async () => {
    setLoading(true);
    try {
      const eligibilityRes = await API.private.checkWithdrawalEligibility();
      if (eligibilityRes.status === 200) {
        const eligible = eligibilityRes.data.eligible;
        const reason = eligibilityRes.data.reason || "";

        if (!eligible) {
          Notification.error(reason || "You are not eligible to request a withdrawal.");
          navigate("/profile");
          return;
        }

        setBalance(eligibilityRes.data.balance || 0);

        // If eligible, fetch withdrawal methods
        const methodsRes = await API.private.getActiveWithdrawalMethods();
        if (methodsRes.status === 200) {
          setMethods(methodsRes.data.methods || []);
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to check eligibility.";
      Notification.error(msg);
      console.log("Eligibility check error:", error);
      navigate("/profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await API.private.createWithdrawalRequest(formData);
      if (res.status === 201) {
        Notification.success(res.data.message || "Withdrawal request submitted successfully.");
        navigate("/wallet-history");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to submit withdrawal request.";
      Notification.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <p className="text-gray-500">Checking eligibility...</p>
      </DefaultLayout>
    );
  }

  if (methods.length === 0) {
    return (
      <DefaultLayout>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-yellow-700 font-medium">
            You do not have any active withdrawal methods. Please add one before requesting a withdrawal.
          </p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Request Withdrawal</h1>
        <p className="text-gray-600">Fill out the form to request a withdrawal from your wallet balance.</p>
      </div>

      <div className="max-w-xl mx-auto">
        <WithdrawalRequestForm
          methods={methods}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          balance={balance}
        />
      </div>
    </DefaultLayout>
  );
};

export default ClientWithdrawals;
