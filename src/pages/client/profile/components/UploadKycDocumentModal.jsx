import React, { useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Select from "react-select";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import StyledFileInput from "@/components/ui/StyledFileInput";
import Spinner from "@/components/ui/Spinner";
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-900 rounded-2xl">
      {/* Document Type Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Document Type</label>
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
                control: (base, state) => ({
                  ...base,
                  backgroundColor: isDark ? "#1E2939" : "#fff",
                  borderColor: errors.document_type
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
        <p className="text-red-500 text-sm">{errors.document_type?.message}</p>
      </div>

      {/* File Input */}
      <StyledFileInput
        label="Upload Document"
        preferredSize="Max size: 5MB"
        file={file}
        onChange={handleFileChange}
        onRemove={removeFile}
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-accent text-white py-2 rounded-md font-semibold flex items-center justify-center shadow transition-all ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/90"
        }`}
      >
        {isSubmitting ? <Spinner color="white" /> : "Upload Document"}
      </button>
    </form>
  );
};

export default UploadKycDocumentModal;
