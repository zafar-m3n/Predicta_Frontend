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
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Email
              </th>
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
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                  No support tickets found.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="odd:bg-gray-50 even:bg-white">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{ticket.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{ticket.subject}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{ticket.User.full_name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{ticket.User.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Badge text={ticket.status} color={ticket.status === "closed" ? "red" : "yellow"} size="sm" />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(ticket.created_at)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleViewDetails(ticket.id)}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition"
                    >
                      <Icon icon="mdi:eye" width="18" />
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
          <div className="p-4 text-center text-gray-500 bg-white rounded shadow">No support tickets found.</div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white p-4 rounded shadow space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-semibold text-gray-700">#{ticket.id}</div>
                <Badge text={ticket.status} color={ticket.status === "closed" ? "red" : "yellow"} size="sm" />
              </div>
              <div className="text-sm text-gray-700">
                <strong>Subject:</strong> {ticket.subject}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Name:</strong> {ticket.User.full_name}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Email:</strong> {ticket.User.email}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Created:</strong> {formatDate(ticket.created_at)}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => handleViewDetails(ticket.id)}
                  className="inline-flex items-center px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition text-sm"
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
