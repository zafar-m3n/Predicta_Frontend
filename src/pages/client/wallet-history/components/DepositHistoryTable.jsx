import React, { useState } from "react";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import { formatDate } from "@/utils/formatDate";

const apiBaseUrl = import.meta.env.VITE_TRADERSROOM_API_BASEURL;

const DepositHistoryTable = ({ deposits, currentPage, totalPages, onPageChange }) => {
  const [proofModal, setProofModal] = useState({ open: false, proofPath: "" });

  const handleViewProof = (proofPath) => {
    setProofModal({ open: true, proofPath });
  };

  const statusColor = (status) => {
    switch (status) {
      case "approved":
        return "green";
      case "pending":
        return "yellow";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  };

  const typeColor = (type) => {
    switch (type) {
      case "bank":
        return "blue";
      case "crypto":
        return "yellow";
      default:
        return "gray";
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "createdAt", label: "Date" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "transaction_reference", label: "Reference" },
    { key: "method", label: "Method" },
    { key: "type", label: "Type" },
    { key: "admin_note", label: "Admin Note" },
    { key: "proof", label: "Proof" },
  ];

  const renderCell = (deposit, col) => {
    switch (col.key) {
      case "createdAt":
        return formatDate(deposit.createdAt);
      case "amount":
        return `$${parseFloat(deposit.amount).toFixed(2)}`;
      case "status":
        return <Badge text={deposit.status} color={statusColor(deposit.status)} size="sm" />;
      case "transaction_reference":
        return deposit.transaction_reference || "-";
      case "method":
        return deposit.DepositMethod?.name || "-";
      case "type":
        return deposit.DepositMethod?.type ? (
          <Badge text={deposit.DepositMethod.type} color={typeColor(deposit.DepositMethod.type)} size="sm" />
        ) : (
          "-"
        );
      case "admin_note":
        return deposit.admin_note || "N/A";
      case "proof":
        return deposit.proof_path ? (
          <button
            onClick={() => handleViewProof(deposit.proof_path)}
            className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="View Proof"
          >
            <Icon icon="mdi:eye" width="18" />
          </button>
        ) : (
          "-"
        );
      default:
        return deposit[col.key];
    }
  };

  return (
    <>
      <Table
        columns={columns}
        data={deposits}
        renderCell={renderCell}
        emptyMessage="No deposit history found."
        className="mb-4"
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />

      <Modal
        isOpen={proofModal.open}
        onClose={() => setProofModal({ open: false, proofPath: "" })}
        title="Proof of Deposit"
        size="md"
        centered
      >
        <div className="flex justify-center items-center">
          {proofModal.proofPath ? (
            <img
              src={`${apiBaseUrl}/${proofModal.proofPath.replace(/\\\\/g, "/")}`}
              alt="Proof"
              className="max-w-full max-h-[400px] rounded shadow"
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">N/A</p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default DepositHistoryTable;
