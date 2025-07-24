import React from "react";
import { useNavigate } from "react-router-dom";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import Pagination from "@/components/ui/Pagination";
import { formatDate } from "@/utils/formatDate";

const SupportTicketsTable = ({ tickets, currentPage, totalPages, onPageChange }) => {
  const navigate = useNavigate();

  const handleViewDetails = (ticketId) => {
    navigate(`/tickets/${ticketId}`);
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "subject", label: "Subject" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
    { key: "created_at", label: "Created At" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = (ticket, col) => {
    switch (col.key) {
      case "category":
        return <span className="capitalize">{ticket.category}</span>;
      case "status":
        return <Badge text={ticket.status} color={ticket.status === "open" ? "yellow" : "green"} size="sm" />;
      case "created_at":
        return formatDate(ticket.created_at);
      case "actions":
        return (
          <button
            onClick={() => handleViewDetails(ticket.id)}
            className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="View"
          >
            <Icon icon="mdi:eye" width="18" className="text-black dark:text-white" />
          </button>
        );
      default:
        return ticket[col.key];
    }
  };

  return (
    <>
      <Table
        columns={columns}
        data={tickets}
        renderCell={renderCell}
        emptyMessage="No support tickets found."
        className="mb-4"
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  );
};

export default SupportTicketsTable;
