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
        <Spinner />
        <p className="text-center text-gray-500 mt-4">Loading deposit options...</p>
      </DefaultLayout>
    );
  }

  if (methods.length === 0) {
    return (
      <DefaultLayout>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-yellow-700 font-medium">
            No deposit methods available at this time. Please check back later or contact support for assistance.
          </p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Deposit Option</h1>
        <p className="text-gray-600">Choose a deposit method to continue.</p>
      </div>

      <DepositMethodsList methods={methods} onSelect={handleSelectMethod} />
    </DefaultLayout>
  );
};

export default ClientDeposits;
