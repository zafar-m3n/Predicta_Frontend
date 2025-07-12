import React from "react";

const apiBaseUrl = import.meta.env.VITE_TRADERSROOM_API_BASEURL;

const TicketMessageBubble = ({ message }) => {
  const isAdmin = message.sender_role === "admin";

  return (
    <div className={`flex flex-col ${isAdmin ? "items-start" : "items-end"}`}>
      <div
        className={`max-w-md w-fit rounded-lg px-4 py-2 ${
          isAdmin ? "bg-gray-100 text-gray-800" : "bg-accent text-white"
        }`}
      >
        <p className="text-sm whitespace-pre-line">{message.message}</p>
        {message.attachment && (
          <div className="mt-2">
            <img
              src={`${apiBaseUrl}/${message.attachment}`}
              alt="Attachment"
              className="max-w-full max-h-[200px] rounded shadow"
            />
          </div>
        )}
      </div>
      <span className="text-xs text-gray-500 mt-1">{formatDate(message.created_at)}</span>
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
