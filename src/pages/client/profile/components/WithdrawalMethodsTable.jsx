import React, { useEffect, useState } from "react";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Modal from "@/components/ui/Modal";
import AddWithdrawalMethodForm from "./AddWithdrawalMethodsForm";
import Spinner from "@/components/ui/Spinner";
import useWidth from "@/hooks/useWidth";

const WithdrawalMethodsTable = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);
  const { width, breakpoints } = useWidth();
  const isMobile = width < breakpoints.md;

  const fetchMethods = async () => {
    try {
      const res = await API.private.getWithdrawalMethods();
      if (res.status === 200 && res.data.code === "OK") {
        setMethods(res.data.data.methods);
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

  const bankMethods = methods.filter((m) => m.type === "bank" && m.status === "active");
  const cryptoMethods = methods.filter((m) => m.type === "crypto" && m.status === "active");

  if (loading) {
    return (
      <>
        <Spinner />
        <p className="text-center text-gray-500 dark:text-gray-400 mt-4">Loading withdrawal details...</p>
      </>
    );
  }

  return (
    <div className="w-full">
      {/* Bank Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Bank Withdrawal Details</h2>
          <button
            onClick={() => setIsBankModalOpen(true)}
            className="bg-accent text-white px-4 py-2 rounded font-medium hover:bg-accent/90 transition"
          >
            {isMobile ? "+" : "Add Bank Details"}
          </button>
        </div>

        <div className="overflow-x-auto rounded">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Bank Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Account Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Account Name
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {bankMethods.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    No bank details methods found.
                  </td>
                </tr>
              ) : (
                bankMethods.map((method) => (
                  <tr
                    key={method.id}
                    className="odd:bg-gray-50 even:bg-white dark:odd:bg-gray-800/90 dark:even:bg-gray-900"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {method.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {method.bank_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {method.account_number}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {method.account_name}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Crypto Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Crypto Withdrawal Details</h2>
          <button
            onClick={() => setIsCryptoModalOpen(true)}
            className="bg-accent text-white px-4 py-2 rounded font-medium hover:bg-accent/90 transition"
          >
            {isMobile ? "+" : "Add Crypto Details"}
          </button>
        </div>

        <div className="overflow-x-auto rounded">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Network
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Wallet Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {cryptoMethods.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    No crypto withdrawal details found.
                  </td>
                </tr>
              ) : (
                cryptoMethods.map((method) => (
                  <tr
                    key={method.id}
                    className="odd:bg-gray-50 even:bg-white dark:odd:bg-gray-800/90 dark:even:bg-gray-900"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {method.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {method.network}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {method.wallet_address}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bank Modal */}
      <Modal isOpen={isBankModalOpen} onClose={() => setIsBankModalOpen(false)} title="Add Bank Withdrawal Details">
        <AddWithdrawalMethodForm type="bank" onSuccess={fetchMethods} onClose={() => setIsBankModalOpen(false)} />
      </Modal>

      {/* Crypto Modal */}
      <Modal
        isOpen={isCryptoModalOpen}
        onClose={() => setIsCryptoModalOpen(false)}
        title="Add Crypto Withdrawal Details"
      >
        <AddWithdrawalMethodForm type="crypto" onSuccess={fetchMethods} onClose={() => setIsCryptoModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default WithdrawalMethodsTable;
