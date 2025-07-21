import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import AdminSupportTicketsTable from "./components/AdminSupportTicketsTable";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";

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
      <div className="py-5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Customer Support Tickets</h1>
        </div>

        {loading ? (
          <>
            <Spinner />
            <p className="text-center text-gray-500 dark:text-gray-400 mt-4">Loading tickets...</p>
          </>
        ) : (
          <AdminSupportTicketsTable
            tickets={tickets}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </DefaultLayout>
  );
};

export default CustomerSupport;
