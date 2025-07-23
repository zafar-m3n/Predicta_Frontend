import React, { useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import Select from "@/components/form/Select";
import AccentButton from "@/components/ui/AccentButton";
import StyledFileInput from "@/components/ui/StyledFileInput";
import Spinner from "@/components/ui/Spinner";
import Notification from "@/components/ui/Notification";

import API from "@/services/index";
import { ThemeContext } from "@/context/ThemeContext";

const schema = Yup.object().shape({
  document_type: Yup.string().required("Document type is required"),
});

const options = [
  { value: "id_card", label: "Identity Card" },
  { value: "drivers_license", label: "Driver’s License" },
  { value: "utility_bill", label: "Utility Bill" },
];

const UploadKycDocumentModal = ({ onSuccess, onClose }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

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

      if ((res.status === 200 || res.status === 201) && res.data.code === "OK") {
        Notification.success(res.data.data.message || "KYC document uploaded successfully.");
        reset();
        setFile(null);
        onSuccess();
        onClose();
      } else {
        Notification.info("Unexpected response. Please check your document.");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong. Please try again.";
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-900 rounded-2xl">
      {/* Document Type */}
      <Controller
        name="document_type"
        control={control}
        render={({ field }) => (
          <Select
            label="Select Document Type"
            options={options}
            placeholder="Choose document type..."
            value={field.value}
            onChange={(val) => field.onChange(val)}
            error={errors.document_type?.message}
          />
        )}
      />

      {/* File Upload */}
      <StyledFileInput
        label="Upload Document"
        preferredSize="Max size: 5MB"
        file={file}
        onChange={handleFileChange}
        onRemove={removeFile}
      />

      {/* Submit Button */}
      <AccentButton type="submit" text="Upload Document" loading={isSubmitting} spinner={<Spinner color="white" />} />
    </form>
  );
};

export default UploadKycDocumentModal;
