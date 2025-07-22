import React, { useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Select from "react-select";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Modal from "@/components/ui/Modal";
import StyledFileInput from "@/components/ui/StyledFileInput";
import Spinner from "@/components/ui/Spinner";
import { ThemeContext } from "@/context/ThemeContext";

const apiBaseUrl = import.meta.env.VITE_TRADERSROOM_API_BASEURL;

const categoryOptions = [
  { value: "general", label: "General" },
  { value: "technical", label: "Technical" },
  { value: "billing", label: "Billing" },
  { value: "other", label: "Other" },
];

const schema = Yup.object().shape({
  subject: Yup.string().required("Subject is required"),
  category: Yup.string().required("Category is required"),
  message: Yup.string().required("Message is required"),
});

const CreateSupportTicketForm = ({ isOpen, onClose, onSuccess }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [attachmentFile, setAttachmentFile] = useState(null);
  const [attachmentPath, setAttachmentPath] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      subject: "",
      category: "",
      message: "",
    },
  });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentFile(e.target.files[0]);
      setAttachmentPath("");
    }
  };

  const removeFile = () => {
    setAttachmentFile(null);
    setAttachmentPath("");
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("subject", data.subject);
    formData.append("category", data.category);
    formData.append("message", data.message);
    if (attachmentFile) {
      formData.append("attachment", attachmentFile);
    }

    setLoading(true);
    try {
      const res = await API.private.createSupportTicket(formData);

      if (res.status === 201 && res.data.code === "OK") {
        Notification.success(res.data.data.message || "Support ticket created successfully.");
        reset();
        setAttachmentFile(null);
        setAttachmentPath("");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        Notification.error("Unexpected response from server.");
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Failed to create support ticket.";
      Notification.error(msg);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Support Ticket" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Subject</label>
          <input
            type="text"
            {...register("subject")}
            placeholder="Enter subject"
            className={`w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-accent transition ${
              errors.subject ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          <p className="text-red-500 text-sm">{errors.subject?.message}</p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Category</label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={categoryOptions}
                placeholder="Select category"
                value={categoryOptions.find((opt) => opt.value === field.value) || null}
                onChange={(selected) => field.onChange(selected ? selected.value : "")}
                classNamePrefix="react-select"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: isDark ? "#1E2939" : "#fff",
                    borderColor: errors.category
                      ? "#f87171"
                      : state.isFocused
                      ? "#309f6d"
                      : isDark
                      ? "#4b5563"
                      : "#d1d5db",
                    color: isDark ? "#f9fafb" : "#111827",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: "#309f6d",
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: isDark ? "#1E2939" : "#fff",
                    color: isDark ? "#f9fafb" : "#111827",
                    zIndex: 50,
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: isDark ? "#f9fafb" : "#111827",
                  }),
                  option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    backgroundColor: isSelected
                      ? "#309f6d"
                      : isFocused
                      ? isDark
                        ? "#4b5563"
                        : "#f3f4f6"
                      : isDark
                      ? "#1E2939"
                      : "#fff",
                    color: isSelected ? "#ffffff" : isDark ? "#f9fafb" : "#111827",
                    cursor: "pointer",
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: isDark ? "#9ca3af" : "#6b7280",
                  }),
                }}
              />
            )}
          />
          <p className="text-red-500 text-sm">{errors.category?.message}</p>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Message</label>
          <textarea
            {...register("message")}
            placeholder="Describe your issue..."
            rows={5}
            className={`w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-accent transition ${
              errors.message ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          <p className="text-red-500 text-sm">{errors.message?.message}</p>
        </div>

        {/* Screenshot */}
        <StyledFileInput
          label="Screenshot"
          preferredSize="Preferred Size 800 × 600"
          file={attachmentFile}
          filePath={attachmentPath ? `${apiBaseUrl}/${attachmentPath}` : ""}
          onChange={handleFileChange}
          onRemove={removeFile}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-accent text-white py-2 rounded font-semibold flex items-center justify-center transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/90"
          }`}
        >
          {loading ? <Spinner color="white" /> : "Submit Ticket"}
        </button>
      </form>
    </Modal>
  );
};

export default CreateSupportTicketForm;
