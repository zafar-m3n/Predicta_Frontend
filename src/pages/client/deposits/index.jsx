import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import DepositMethodsList from "./components/DepositMethodsList";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";

const ClientDeposits = () => {
  const navigate = useNavigate();
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveMethods();
  }, []);

  const fetchActiveMethods = async () => {
    setLoading(true);
    try {
      const res = await API.private.getActiveDepositMethods();
      if (res.status === 200 && res.data.code === "OK") {
        setMethods(res.data.data.methods || []);
      } else {
        Notification.error(res.data.error || "Failed to load deposit methods.");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to load deposit methods.";
      Notification.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMethod = (method) => {
    navigate(`/deposits/new/${method.id}`);
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="py-5 flex flex-col items-center justify-center text-center">
          <Spinner />
          <p className="text-gray-500 mt-4">Loading deposit options...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (methods.length === 0) {
    return (
      <DefaultLayout>
        <div className="bg-yellow-50 dark:bg-yellow-100/10 border-l-4 border-yellow-400 px-4 py-5 rounded text-yellow-700 dark:text-yellow-300">
          <p className="font-medium">
            No deposit methods available at this time. Please check back later or contact support for assistance.
          </p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="py-5">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Deposit Option</h1>
        <p className="text-gray-600 dark:text-gray-400">Choose a deposit method to continue.</p>
      </div>

      <DepositMethodsList methods={methods} onSelect={handleSelectMethod} />
    </DefaultLayout>
  );
};

export default ClientDeposits;
