import React from "react";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";

const DepositHistoryTable = ({ deposits }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(
      2,
      "0"
    )} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
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

  const API_BASE_URL = import.meta.env.VITE_TRADERSROOM_API_BASEURL || "";

  return (
    <div className="overflow-x-auto rounded shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reference
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Admin Note
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proof</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {deposits.length === 0 ? (
            <tr>
              <td colSpan="9" className="px-4 py-6 text-center text-gray-500">
                No deposit history found.
              </td>
            </tr>
          ) : (
            deposits.map((deposit) => (
              <tr key={deposit.id} className="odd:bg-gray-50 even:bg-white">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{deposit.id}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(deposit.createdAt)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  ${parseFloat(deposit.amount).toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <Badge text={deposit.status} color={statusColor(deposit.status)} size="sm" />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {deposit.transaction_reference || "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {deposit.DepositMethod?.name || "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {deposit.DepositMethod?.type ? (
                    <Badge text={deposit.DepositMethod.type} color={typeColor(deposit.DepositMethod.type)} size="sm" />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{deposit.admin_note || "N/A"}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {deposit.proof_path ? (
                    <a
                      href={`${API_BASE_URL}/${deposit.proof_path.replace(/\\/g, "/")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent font-medium hover:underline flex items-center"
                    >
                      <Icon icon="mdi:eye" width="18" className="mr-1" />
                      View
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DepositHistoryTable;
