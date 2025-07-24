import React, { useEffect, useState } from "react";
import API from "@/services/index";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Notification from "@/components/ui/Notification";
import AddWithdrawalMethodForm from "./AddWithdrawalMethodsForm";
import Spinner from "@/components/ui/Spinner";
import Heading from "@/components/ui/Heading";
import AccentButton from "@/components/ui/AccentButton";
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

  const bankColumns = [
    { key: "id", label: "ID" },
    { key: "bank_name", label: "Bank Name" },
    { key: "account_number", label: "Account Number" },
    { key: "account_name", label: "Account Name" },
  ];

  const cryptoColumns = [
    { key: "id", label: "ID" },
    { key: "network", label: "Network" },
    { key: "wallet_address", label: "Wallet Address" },
  ];

  const renderBankCell = (method, col) => method[col.key] || "-";
  const renderCryptoCell = (method, col) => method[col.key] || "-";

  if (loading) return <Spinner message="Loading withdrawal details" />;

  return (
    <div className="w-full">
      {/* Bank Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex justify-between items-center mb-6">
          <Heading>Bank Withdrawal Details</Heading>
          <div className="w-fit">
            <AccentButton onClick={() => setIsBankModalOpen(true)} text={isMobile ? "+" : "Add Bank Details"} />
          </div>
        </div>

        <Table
          columns={bankColumns}
          data={bankMethods}
          renderCell={renderBankCell}
          emptyMessage="No bank details methods found."
        />
      </div>

      {/* Crypto Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <Heading>Crypto Withdrawal Details</Heading>
          <div className="w-fit">
            <AccentButton onClick={() => setIsCryptoModalOpen(true)} text={isMobile ? "+" : "Add Crypto Details"} />
          </div>
        </div>

        <Table
          columns={cryptoColumns}
          data={cryptoMethods}
          renderCell={renderCryptoCell}
          emptyMessage="No crypto withdrawal details found."
        />
      </div>

      {/* Modals */}
      <Modal isOpen={isBankModalOpen} onClose={() => setIsBankModalOpen(false)} title="Add Bank Withdrawal Details">
        <AddWithdrawalMethodForm type="bank" onSuccess={fetchMethods} onClose={() => setIsBankModalOpen(false)} />
      </Modal>

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
