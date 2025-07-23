import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import TextInput from "@/components/form/TextInput";
import Select from "@/components/form/Select";
import AccentButton from "@/components/ui/AccentButton";
import StyledFileInput from "@/components/ui/StyledFileInput";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Support Ticket" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput
          label="Subject"
          placeholder="Enter subject"
          error={errors.subject?.message}
          {...register("subject")}
        />

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select
              label="Category"
              placeholder="Choose Ticket Category"
              options={categoryOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.category?.message}
            />
          )}
        />

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-800 dark:text-gray-200">Message</label>
          <textarea
            {...register("message")}
            placeholder="Describe your issue..."
            rows={5}
            className={`w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-accent transition ${
              errors.message ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            }`}
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
        </div>

        <StyledFileInput
          label="Screenshot"
          preferredSize="Preferred Size 800 × 600"
          file={attachmentFile}
          filePath={attachmentPath ? `${apiBaseUrl}/${attachmentPath}` : ""}
          onChange={handleFileChange}
          onRemove={removeFile}
        />

        <AccentButton
          type="submit"
          text="Submit Ticket"
          disabled={loading}
          loading={loading}
          spinner={<Spinner color="white" />}
        />
      </form>
    </Modal>
  );
};

export default CreateSupportTicketForm;
