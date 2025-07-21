import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import SupportTicketsTable from "./components/SupportTicketsTable";
import CreateSupportTicketForm from "./components/CreateSupportTicketForm";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";
import useWidth from "@/hooks/useWidth";

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { width, breakpoints } = useWidth();
  const isMobile = width < breakpoints.md;

  // Fetch tickets
  const fetchTickets = async (page = 1) => {
    setLoading(true);
    try {
      const res = await API.private.getMySupportTickets({ page });
      if (res.data.code === "OK") {
        const data = res.data.data;
        setTickets(data.tickets || []);
        setCurrentPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
      } else {
        Notification.error(res.data.error || "Failed to load support tickets.");
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to load support tickets.";
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
      <div className="py-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Support Tickets</h1>
          <button
            onClick={handleOpenCreateModal}
            className="bg-accent text-white px-4 py-2 rounded font-medium hover:bg-accent/90 transition"
          >
            {isMobile ? "+" : "New Ticket"}
          </button>
        </div>

        {loading ? (
          <>
            <Spinner />
            <p className="text-center text-gray-500 mt-4">Loading tickets...</p>
          </>
        ) : (
          <SupportTicketsTable
            tickets={tickets}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <CreateSupportTicketForm
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          onSuccess={handleTicketCreated}
        />
      </div>
    </DefaultLayout>
  );
};

export default SupportTickets;
