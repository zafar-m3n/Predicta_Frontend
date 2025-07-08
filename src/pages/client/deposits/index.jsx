import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import DepositMethodsList from "./components/DepositMethodsList";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";

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
      setMethods(res.data.methods || []);
    } catch (error) {
      Notification.error("Failed to load deposit methods.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMethod = (method) => {
    navigate(`/deposits/new/${method.id}`);
  };

  return (
    <DefaultLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Deposit Option</h1>
        <p className="text-gray-600">Choose a deposit method to continue.</p>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading deposit methods...</p>
      ) : (
        <DepositMethodsList methods={methods} onSelect={handleSelectMethod} />
      )}
    </DefaultLayout>
  );
};

export default ClientDeposits;
