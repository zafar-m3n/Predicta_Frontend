import React from "react";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";

const DepositMethodsTable = ({ methods, onEdit, onToggleStatus, onView }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(
      2,
      "0"
    )} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="overflow-x-auto rounded shadow">
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
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                    className="inline-flex items-center px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    <Icon icon="mdi:eye" width="18" />
                  </button>
                  <button
                    onClick={() => onEdit(method)}
                    className="inline-flex items-center px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    <Icon icon="mdi:pencil" width="18" />
                  </button>
                  <button
                    onClick={() => onToggleStatus(method)}
                    className="inline-flex items-center px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
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
  );
};

export default DepositMethodsTable;
