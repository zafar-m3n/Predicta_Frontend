import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import DepositMethodsList from "./components/DepositMethodsList";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";
import Heading from "@/components/ui/Heading";

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
        <Spinner className="Loading Deposit Options..." />
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
      <Heading>Deposit Option</Heading>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">Choose a deposit method to continue.</p>
      <DepositMethodsList methods={methods} onSelect={handleSelectMethod} />
    </DefaultLayout>
  );
};

export default ClientDeposits;
