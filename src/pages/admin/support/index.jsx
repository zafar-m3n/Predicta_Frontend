import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import AdminSupportTicketsTable from "./components/AdminSupportTicketsTable";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";
import Heading from "@/components/ui/Heading";

const CustomerSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch tickets
  const fetchTickets = async (page = 1) => {
    setLoading(true);
    try {
      const res = await API.private.getAllSupportTickets({ page });
      if (res.status === 200 && res.data.code === "OK") {
        setTickets(res.data.data.tickets || []);
        setCurrentPage(res.data.data.page || 1);
        setTotalPages(res.data.data.totalPages || 1);
      } else {
        Notification.error(res.data.error || "Failed to load support tickets.");
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to load support tickets.";
      Notification.error(msg);
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

  return (
    <DefaultLayout>
      <div className="flex items-center justify-between mb-6">
        <Heading>Customer Support Tickets</Heading>
      </div>

      {loading ? (
        <Spinner message="Loading tickets..." />
      ) : (
        <AdminSupportTicketsTable
          tickets={tickets}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </DefaultLayout>
  );
};

export default CustomerSupport;
