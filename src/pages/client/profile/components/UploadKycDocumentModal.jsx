import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";

const schema = Yup.object().shape({
  document_type: Yup.string().required("Document type is required"),
  document: Yup.mixed().required("Document file is required"),
});

const UploadKycDocumentModal = ({ onSuccess, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("document_type", data.document_type);
      formData.append("document", data.document[0]);

      const res = await API.private.uploadKycDocument(formData);

      if (res.status === 201) {
        Notification.success(res.data.message || "KYC document uploaded successfully!");
        reset();
        onSuccess();
        onClose();
      }
    } catch (error) {
      let msg = "Something went wrong. Please try again.";
      if (error.response?.data?.message) {
        msg = error.response.data.message;
      }
      Notification.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <select
        {...register("document_type")}
        className={`w-full border rounded px-3 py-2 focus:outline-none ${
          errors.document_type ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Select Document Type</option>
        <option value="id_card">Identity Card</option>
        <option value="driver_license">Driver’s License</option>
        <option value="utility_bill">Utility Bill</option>
      </select>
      <p className="text-red-500 text-sm">{errors.document_type?.message}</p>

      <input
        type="file"
        {...register("document")}
        className={`w-full border rounded px-3 py-2 focus:outline-none ${
          errors.document ? "border-red-500" : "border-gray-300"
        }`}
      />
      <p className="text-red-500 text-sm">{errors.document?.message}</p>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-accent text-white py-2 rounded font-semibold transition ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/90"
        }`}
      >
        {isSubmitting ? "Uploading..." : "Upload Document"}
      </button>
    </form>
  );
};

export default UploadKycDocumentModal;
