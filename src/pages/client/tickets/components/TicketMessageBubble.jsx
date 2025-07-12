import React, { useState } from "react";
import Modal from "@/components/ui/Modal";

const apiBaseUrl = import.meta.env.VITE_TRADERSROOM_API_BASEURL;

const TicketMessageBubble = ({ message }) => {
  const isAdmin = message.sender === "admin"; // Check your API field here ("sender_role" vs "sender")
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={`flex flex-col ${isAdmin ? "items-start" : "items-end"}`}>
      {message.attachment_path && (
        <button onClick={handleOpenModal} className="text-xs text-accent mb-1 hover:underline">
          See Attachment
        </button>
      )}

      <div
        className={`max-w-md w-fit rounded-lg px-4 py-2 ${
          isAdmin ? "bg-gray-100 text-gray-800" : "bg-accent text-white"
        }`}
      >
        <p className="text-sm whitespace-pre-line">{message.message}</p>
      </div>

      <span className="text-xs text-gray-500 mt-1">{formatDate(message.created_at)}</span>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Attachment" size="lg" centered>
        <div className="flex justify-center">
          <img
            src={`${apiBaseUrl}/${message.attachment_path}`}
            alt="Attachment"
            className="max-w-full max-h-[500px] rounded shadow"
          />
        </div>
      </Modal>
    </div>
  );
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(
    2,
    "0"
  )} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

export default TicketMessageBubble;
