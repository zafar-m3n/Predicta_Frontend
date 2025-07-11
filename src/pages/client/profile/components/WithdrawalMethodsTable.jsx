import React, { useEffect, useState } from "react";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Modal from "@/components/ui/Modal";
import AddWithdrawalMethodForm from "./AddWithdrawalMethodsForm";

const WithdrawalMethodsTable = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);

  const fetchMethods = async () => {
    try {
      const res = await API.private.getWithdrawalMethods();
      if (res.status === 200) {
        setMethods(res.data.methods);
      }
    } catch (error) {
      Notification.error("Failed to fetch withdrawal methods.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await API.private.deleteWithdrawalMethod(id);
      if (res.status === 200) {
        Notification.success(res.data.message || "Method deactivated successfully.");
        fetchMethods();
      }
    } catch (error) {
      Notification.error("Failed to deactivate method.");
    }
  };

  const bankMethods = methods.filter((m) => m.type === "bank" && m.status === "active");
  const cryptoMethods = methods.filter((m) => m.type === "crypto" && m.status === "active");

  if (loading) return <div>Loading withdrawal methods...</div>;

  return (
    <div className="w-full space-y-10">
      {/* Bank methods table */}
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bank Withdrawal Methods</h2>
          <button
            onClick={() => setIsBankModalOpen(true)}
            className="bg-accent text-white px-4 py-2 rounded font-medium hover:bg-accent/90 transition"
          >
            Add Bank Method
          </button>
        </div>

        {bankMethods.length > 0 ? (
          <table className="w-full text-left border">
            <thead>
              <tr>
                <th className="py-2 px-3 border-b">Bank Name</th>
                <th className="py-2 px-3 border-b">Account Number</th>
                <th className="py-2 px-3 border-b">Account Name</th>
                <th className="py-2 px-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bankMethods.map((method) => (
                <tr key={method.id}>
                  <td className="py-2 px-3 border-b">{method.bank_name}</td>
                  <td className="py-2 px-3 border-b">{method.account_number}</td>
                  <td className="py-2 px-3 border-b">{method.account_name}</td>
                  <td className="py-2 px-3 border-b">
                    <button onClick={() => handleDelete(method.id)} className="text-red-500 hover:underline">
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No active bank withdrawal methods found.</p>
        )}
      </div>

      {/* Crypto methods table */}
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Crypto Withdrawal Methods</h2>
          <button
            onClick={() => setIsCryptoModalOpen(true)}
            className="bg-accent text-white px-4 py-2 rounded font-medium hover:bg-accent/90 transition"
          >
            Add Crypto Method
          </button>
        </div>

        {cryptoMethods.length > 0 ? (
          <table className="w-full text-left border">
            <thead>
              <tr>
                <th className="py-2 px-3 border-b">Network</th>
                <th className="py-2 px-3 border-b">Wallet Address</th>
                <th className="py-2 px-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cryptoMethods.map((method) => (
                <tr key={method.id}>
                  <td className="py-2 px-3 border-b">{method.network}</td>
                  <td className="py-2 px-3 border-b">{method.wallet_address}</td>
                  <td className="py-2 px-3 border-b">
                    <button onClick={() => handleDelete(method.id)} className="text-red-500 hover:underline">
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No active crypto withdrawal methods found.</p>
        )}
      </div>

      {/* Bank Modal */}
      <Modal isOpen={isBankModalOpen} onClose={() => setIsBankModalOpen(false)} title="Add Bank Withdrawal Method">
        <AddWithdrawalMethodForm type="bank" onSuccess={fetchMethods} onClose={() => setIsBankModalOpen(false)} />
      </Modal>

      {/* Crypto Modal */}
      <Modal
        isOpen={isCryptoModalOpen}
        onClose={() => setIsCryptoModalOpen(false)}
        title="Add Crypto Withdrawal Method"
      >
        <AddWithdrawalMethodForm type="crypto" onSuccess={fetchMethods} onClose={() => setIsCryptoModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default WithdrawalMethodsTable;
