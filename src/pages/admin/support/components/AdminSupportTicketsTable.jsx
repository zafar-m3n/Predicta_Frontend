import React from "react";
import { useNavigate } from "react-router-dom";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import Pagination from "@/components/ui/Pagination";
import { formatDate } from "@/utils/formatDate";

const AdminSupportTicketsTable = ({ tickets, currentPage, totalPages, onPageChange }) => {
  const navigate = useNavigate();

  const handleViewDetails = (ticketId) => {
    navigate(`/admin/support/${ticketId}`);
  };

  return (
    <>
      {/* Desktop table */}
      <div className="overflow-x-auto rounded shadow hidden md:block">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {["ID", "Subject", "User Name", "User Email", "Status", "Created At", "Actions"].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                  No support tickets found.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="odd:bg-gray-50 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-700">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{ticket.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                    {ticket.subject}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                    {ticket.User.full_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                    {ticket.User.email}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Badge text={ticket.status} color={ticket.status === "closed" ? "red" : "yellow"} size="sm" />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(ticket.created_at)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleViewDetails(ticket.id)}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <Icon icon="mdi:eye" width="18" className="text-black dark:text-white" />
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
        {tickets.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded shadow">
            No support tickets found.
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">#{ticket.id}</div>
                <Badge text={ticket.status} color={ticket.status === "closed" ? "red" : "yellow"} size="sm" />
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-200">
                <strong>Subject:</strong> {ticket.subject}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-200">
                <strong>Name:</strong> {ticket.User.full_name}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-200">
                <strong>Email:</strong> {ticket.User.email}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Created:</strong> {formatDate(ticket.created_at)}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => handleViewDetails(ticket.id)}
                  className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm text-black dark:text-gray-200"
                >
                  <Icon icon="mdi:eye" width="18" className="mr-1" /> View
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} className="mt-4" />
    </>
  );
};

export default AdminSupportTicketsTable;
