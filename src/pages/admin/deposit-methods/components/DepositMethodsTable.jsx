import React, { useState } from "react";
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

  return (
    <>
      {/* Desktop table */}
      <div className="overflow-x-auto rounded shadow hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {methods.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  No deposit methods found.
                </td>
              </tr>
            ) : (
              methods.map((method) => (
                <tr key={method.id} className="odd:bg-gray-50 even:bg-white">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{method.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{method.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Badge
                      text={method.type}
                      color={method.type === "bank" ? "blue" : method.type === "crypto" ? "yellow" : "gray"}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Badge text={method.status} color={method.status === "active" ? "green" : "red"} size="sm" />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(method.createdAt)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => onView(method)}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition"
                    >
                      <Icon icon="mdi:eye" width="18" />
                    </button>
                    <button
                      onClick={() => onEdit(method)}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition"
                    >
                      <Icon icon="mdi:pencil" width="18" />
                    </button>
                    <button
                      onClick={() => handleToggleClick(method)}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition"
                    >
                      <Icon
                        icon={method.status === "active" ? "mdi:toggle-switch" : "mdi:toggle-switch-off-outline"}
                        width="20"
                      />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="md:hidden space-y-4">
        {methods.length === 0 ? (
          <div className="p-4 text-center text-gray-500 bg-white rounded shadow">No deposit methods found.</div>
        ) : (
          methods.map((method) => (
            <div key={method.id} className="bg-white p-4 rounded shadow space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-semibold text-gray-700">#{method.id}</div>
                <Badge text={method.status} color={method.status === "active" ? "green" : "red"} size="sm" />
              </div>
              <div className="text-sm text-gray-700">
                <strong>Name:</strong> {method.name}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Type:</strong>{" "}
                <Badge
                  text={method.type}
                  color={method.type === "bank" ? "blue" : method.type === "crypto" ? "yellow" : "gray"}
                  size="sm"
                />
              </div>
              <div className="text-sm text-gray-600">
                <strong>Created:</strong> {formatDate(method.createdAt)}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => onView(method)}
                  className="inline-flex items-center px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition text-sm"
                >
                  <Icon icon="mdi:eye" width="18" className="mr-1" /> View
                </button>
                <button
                  onClick={() => onEdit(method)}
                  className="inline-flex items-center px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition text-sm"
                >
                  <Icon icon="mdi:pencil" width="18" className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleToggleClick(method)}
                  className="inline-flex items-center px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition text-sm"
                >
                  <Icon
                    icon={method.status === "active" ? "mdi:toggle-switch" : "mdi:toggle-switch-off-outline"}
                    width="20"
                    className="mr-1"
                  />
                  {method.status === "active" ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} className="mt-4" />

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, method: null })}
        title="Confirm Status Change"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to{" "}
            <strong>{confirmModal.method?.status === "active" ? "deactivate" : "activate"}</strong> this deposit method?
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setConfirmModal({ open: false, method: null })}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
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
