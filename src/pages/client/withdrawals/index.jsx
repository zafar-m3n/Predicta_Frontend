import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import WithdrawalRequestForm from "./components/WithdrawalRequestForm";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/ui/Spinner";
import Heading from "@/components/ui/Heading";

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
      if (eligibilityRes.status === 200 && eligibilityRes.data.code === "OK") {
        const eligible = eligibilityRes.data.data.eligible;
        const reason = eligibilityRes.data.data.reason || "";

        if (!eligible) {
          Notification.error(reason || "You are not eligible to request a withdrawal.");
          navigate("/profile");
          return;
        }

        setBalance(eligibilityRes.data.data.balance || 0);

        const methodsRes = await API.private.getActiveWithdrawalMethods();
        if (methodsRes.status === 200 && methodsRes.data.code === "OK") {
          setMethods(methodsRes.data.data.methods || []);
        } else {
          Notification.error(methodsRes.data.error || "Failed to load withdrawal methods.");
        }
      } else {
        Notification.error(eligibilityRes.data.error || "Eligibility check failed.");
        navigate("/profile");
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to check eligibility.";
      Notification.error(msg);
      navigate("/profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await API.private.createWithdrawalRequest(formData);
      if (res.status === 201 && res.data.code === "OK") {
        Notification.success(res.data.data.message || "Withdrawal request submitted successfully.");
        navigate("/wallet-history");
      } else {
        Notification.error(res.data.error || "Unexpected error during withdrawal request.");
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to submit withdrawal request.";
      Notification.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <Spinner message="Please wait while we check if you are eligible for a withdrawal." />
      </DefaultLayout>
    );
  }

  if (methods.length === 0) {
    return (
      <DefaultLayout>
        <div className="bg-yellow-50 dark:bg-yellow-100/10 border-l-4 border-yellow-400 px-4 py-5 rounded text-yellow-700 dark:text-yellow-300 font-medium">
          You do not have any active withdrawal details. Please add one from your profile page before requesting a
          withdrawal.
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Heading>Request Withdrawal</Heading>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
        Fill out the form to request a withdrawal from your wallet balance.
      </p>

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
