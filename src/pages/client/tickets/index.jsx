import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import SupportTicketsTable from "./components/SupportTicketsTable";
import CreateSupportTicketForm from "./components/CreateSupportTicketForm";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch tickets
  const fetchTickets = async (page = 1) => {
    setLoading(true);
    try {
      const res = await API.private.getMySupportTickets({ page });
      if (res.status === 200) {
        setTickets(res.data.tickets || []);
        setCurrentPage(res.data.page || 1);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to load support tickets.";
      Notification.error(msg);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchTickets(page);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleTicketCreated = () => {
    fetchTickets(currentPage);
    setIsCreateModalOpen(false);
  };

  return (
    <DefaultLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <button
          onClick={handleOpenCreateModal}
          className="bg-accent text-white px-4 py-2 rounded font-medium hover:bg-accent/90 transition"
        >
          New Ticket
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading tickets...</div>
      ) : (
        <SupportTicketsTable
          tickets={tickets}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Create Ticket Modal */}
      <CreateSupportTicketForm
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleTicketCreated}
      />
    </DefaultLayout>
  );
};

export default SupportTickets;
