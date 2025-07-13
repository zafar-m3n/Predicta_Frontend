import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Badge from "@/components/ui/Badge";
import TicketMessageBubble from "./components/TicketMessageBubble";
import DefaultLayout from "@/layouts/DefaultLayout";
import Icon from "@/components/ui/Icon";
import Spinner from "@/components/ui/Spinner";

const schema = yup.object().shape({
  message: yup.string().required("Message is required"),
});

const SupportTicketDetails = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [attachmentFile, setAttachmentFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchTicketDetails = async () => {
    setLoading(true);
    try {
      const res = await API.private.getMySupportTicketById(ticketId);
      if (res.status === 200 && res.data.code === "OK") {
        setTicket(res.data.data.ticket);
      } else {
        Notification.error(res.data.error || "Failed to load ticket details.");
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to load ticket details.";
      Notification.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails();
    }
  }, [ticketId]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setAttachmentFile(null);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("message", data.message);
    if (attachmentFile) {
      formData.append("attachment", attachmentFile);
    }

    setSending(true);
    try {
      const res = await API.private.addSupportMessage(ticketId, formData);
      if (res.status === 201 && res.data.code === "OK") {
        Notification.success(res.data.data.message || "Reply sent successfully.");
        reset();
        setAttachmentFile(null);
        fetchTicketDetails();
      } else {
        Notification.error(res.data.error || "Failed to send reply.");
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to send reply.";
      Notification.error(msg);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <>
          <Spinner />
          <p className="text-center text-gray-500 mt-4">Loading ticket details...</p>
        </>
      </DefaultLayout>
    );
  }

  if (!ticket) {
    return (
      <DefaultLayout>
        <div className="text-center text-gray-500 py-12">Ticket not found.</div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-accent hover:underline flex items-center space-x-1 text-sm"
        >
          ← <span>Back to tickets</span>
        </button>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold mb-1">{ticket.subject}</h2>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge text={ticket.category} color="blue" size="sm" />
              <Badge text={ticket.status} color={ticket.status === "closed" ? "red" : "yellow"} size="sm" />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto pr-2 bg-gray-50 p-4 rounded border border-gray-200">
          {ticket.SupportTicketMessages.map((msg) => (
            <TicketMessageBubble key={msg.id} message={msg} />
          ))}
        </div>

        {ticket.status !== "closed" && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {attachmentFile && (
              <div className="flex items-center justify-between bg-gray-100 border border-gray-300 px-3 py-2 rounded">
                <span className="text-sm text-gray-700 truncate max-w-[250px]">{attachmentFile.name}</span>
                <button type="button" onClick={removeFile} className="text-gray-500 hover:text-gray-700">
                  <Icon icon="mdi:close" width="18" />
                </button>
              </div>
            )}

            <div className="flex items-center border border-gray-300 rounded overflow-hidden focus-within:border-accent shadow-sm">
              <input
                {...register("message")}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 outline-none text-sm bg-white"
              />

              <label
                htmlFor="attachment"
                className="cursor-pointer px-3 py-2 hover:bg-gray-100 border-l border-gray-300 flex items-center"
              >
                <Icon icon="mdi:paperclip" width="20" />
              </label>
              <input id="attachment" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

              <button
                type="submit"
                disabled={sending}
                className={`px-4 py-2 bg-accent text-white flex items-center justify-center font-medium hover:bg-accent/90 transition disabled:opacity-50`}
              >
                {sending ? <Spinner color="white" /> : <Icon icon="mdi:send" width="20" />}
              </button>
            </div>

            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
          </form>
        )}
      </div>
    </DefaultLayout>
  );
};

export default SupportTicketDetails;
