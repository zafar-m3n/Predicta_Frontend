import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import SupportTicketsTable from "./components/SupportTicketsTable";
import CreateSupportTicketForm from "./components/CreateSupportTicketForm";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";
import Heading from "@/components/ui/Heading";
import AccentButton from "@/components/ui/AccentButton";
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
      <div className="flex justify-between items-center mb-6">
        <Heading>Support Tickets</Heading>
        <div className="w-fit">
          <AccentButton onClick={handleOpenCreateModal} text={isMobile ? "+" : "New Ticket"} />
        </div>
      </div>

      {loading ? (
        <Spinner message="Loading your tickets..." />
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
    </DefaultLayout>
  );
};

export default SupportTickets;
