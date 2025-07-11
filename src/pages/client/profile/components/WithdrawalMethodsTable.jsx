import React, { useEffect, useState } from "react";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Modal from "@/components/ui/Modal";
import AddWithdrawalMethodForm from "./AddWithdrawalMethodsForm";
import IconComponent from "@/components/ui/Icon"; // Your custom Icon component

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
      <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bank Withdrawal Methods</h2>
          <button
            onClick={() => setIsBankModalOpen(true)}
            className="bg-accent text-white px-4 py-2 rounded font-medium hover:bg-accent/90 transition"
          >
            Add Bank Method
          </button>
        </div>

        <div className="overflow-x-auto rounded">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bankMethods.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                    No active bank withdrawal methods found.
                  </td>
                </tr>
              ) : (
                bankMethods.map((method) => (
                  <tr key={method.id} className="odd:bg-gray-50 even:bg-white">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{method.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{method.bank_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{method.account_number}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{method.account_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDelete(method.id)}
                        className="inline-flex items-center px-2 py-1 border border-red-300 rounded hover:bg-red-50 transition"
                      >
                        <IconComponent icon="mdi:delete-outline" width="18" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Crypto methods table */}
      <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Crypto Withdrawal Methods</h2>
          <button
            onClick={() => setIsCryptoModalOpen(true)}
            className="bg-accent text-white px-4 py-2 rounded font-medium hover:bg-accent/90 transition"
          >
            Add Crypto Method
          </button>
        </div>

        <div className="overflow-x-auto rounded">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Network
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wallet Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cryptoMethods.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                    No active crypto withdrawal methods found.
                  </td>
                </tr>
              ) : (
                cryptoMethods.map((method) => (
                  <tr key={method.id} className="odd:bg-gray-50 even:bg-white">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{method.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{method.network}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{method.wallet_address}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDelete(method.id)}
                        className="inline-flex items-center px-2 py-1 border border-red-300 rounded hover:bg-red-50 transition"
                      >
                        <IconComponent icon="mdi:delete-outline" width="18" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
