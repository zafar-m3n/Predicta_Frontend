import React, { useState } from "react";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import { formatDate } from "@/utils/formatDate";

const DepositMethodsTable = ({ methods, currentPage, totalPages, onPageChange, onEdit, onToggleStatus, onView }) => {
  const [confirmModal, setConfirmModal] = useState({ open: false, method: null });

  const handleToggleClick = (method) => {
    setConfirmModal({ open: true, method });
  };

  const confirmToggle = () => {
    if (confirmModal.method) {
      onToggleStatus(confirmModal.method);
    }
    setConfirmModal({ open: false, method: null });
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created At" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = (method, col) => {
    switch (col.key) {
      case "type":
        return (
          <Badge
            text={method.type}
            color={method.type === "bank" ? "blue" : method.type === "crypto" ? "yellow" : "gray"}
            size="sm"
          />
        );
      case "status":
        return <Badge text={method.status} color={method.status === "active" ? "green" : "red"} size="sm" />;
      case "createdAt":
        return formatDate(method.createdAt);
      case "actions":
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => onView(method)}
              className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <Icon icon="mdi:eye" width="18" className="text-gray-800 dark:text-gray-200" />
            </button>
            <button
              onClick={() => onEdit(method)}
              className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <Icon icon="mdi:pencil" width="18" className="text-gray-800 dark:text-gray-200" />
            </button>
            <button
              onClick={() => handleToggleClick(method)}
              className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <Icon
                icon={method.status === "active" ? "mdi:toggle-switch" : "mdi:toggle-switch-off-outline"}
                width="20"
                className="text-gray-800 dark:text-gray-200"
              />
            </button>
          </div>
        );
      default:
        return method[col.key];
    }
  };

  return (
    <>
      <Table columns={columns} data={methods} renderCell={renderCell} emptyMessage="No deposit methods found." />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} className="mt-4" />

      <Modal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, method: null })}
        title="Confirm Status Change"
      >
        <div className="space-y-4">
          <p className="text-gray-800 dark:text-gray-200">
            Are you sure you want to{" "}
            <strong>{confirmModal.method?.status === "active" ? "deactivate" : "activate"}</strong> this deposit method?
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setConfirmModal({ open: false, method: null })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={confirmToggle}
              className="px-4 py-2 bg-accent text-white rounded font-semibold hover:bg-accent/90 transition"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DepositMethodsTable;
