import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { formatDate } from "@/utils/formatDate";

const apiBaseUrl = import.meta.env.VITE_TRADERSROOM_API_BASEURL;

const AdminTicketMessageBubble = ({ message }) => {
  const isClient = message.sender === "client";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className={`flex flex-col ${isClient ? "items-start" : "items-end"}`}>
      {message.attachment_path && (
        <button onClick={handleOpenModal} className="text-xs text-accent dark:text-accent mb-1 hover:underline">
          See Attachment
        </button>
      )}

      <div
        className={`max-w-md w-fit rounded-lg px-4 py-2 ${
          isClient ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100" : "bg-accent text-white"
        }`}
      >
        <p className="text-sm whitespace-pre-line">{message.message}</p>
      </div>

      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(message.created_at)}</span>

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

export default AdminTicketMessageBubble;
