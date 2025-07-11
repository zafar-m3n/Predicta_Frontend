import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Select from "react-select";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import StyledFileInput from "@/components/ui/StyledFileInput";

const schema = Yup.object().shape({
  document_type: Yup.string().required("Document type is required"),
});

const options = [
  { value: "id_card", label: "Identity Card" },
  { value: "driver_license", label: "Driver’s License" },
  { value: "utility_bill", label: "Utility Bill" },
];

const UploadKycDocumentModal = ({ onSuccess, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!file) {
      Notification.error("Please upload a document file.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("document_type", data.document_type);
      formData.append("document", file);

      const res = await API.private.uploadKycDocument(formData);

      if (res.status === 200) {
        Notification.success(res.data.message || "KYC document updated successfully.");
      } else if (res.status === 201) {
        Notification.success(res.data.message || "KYC document uploaded successfully.");
      } else {
        Notification.info("Unexpected response. Please check your document.");
      }

      reset();
      setFile(null);
      onSuccess();
      onClose();
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Document Type</label>
        <Controller
          name="document_type"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={options}
              placeholder="Choose document type..."
              classNamePrefix="react-select"
              onChange={(option) => field.onChange(option.value)}
              value={options.find((opt) => opt.value === field.value) || null}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: errors.document_type ? "#f87171" : base.borderColor,
                }),
              }}
            />
          )}
        />
        <p className="text-red-500 text-sm">{errors.document_type?.message}</p>
      </div>

      <StyledFileInput
        label="Upload Document"
        preferredSize="Max size: 5MB"
        file={file}
        onChange={handleFileChange}
        onRemove={removeFile}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-accent text-white py-2 rounded-md font-semibold shadow transition-all ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/90"
        }`}
      >
        {isSubmitting ? "Uploading..." : "Upload Document"}
      </button>
    </form>
  );
};

export default UploadKycDocumentModal;
