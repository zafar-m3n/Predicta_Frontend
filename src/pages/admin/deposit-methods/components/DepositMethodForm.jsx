import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Switch from "@/components/ui/Switch";
import StyledFileInput from "@/components/ui/StyledFileInput";
import Select from "react-select";
import Spinner from "@/components/ui/Spinner";

const apiBaseUrl = import.meta.env.VITE_TRADERSROOM_API_BASEURL;

const DepositMethodForm = ({ initialData = null, onSubmit, isSubmitting }) => {
  const [qrCodeFile, setQrCodeFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [status, setStatus] = useState(initialData?.status === "active");

  const [qrCodePath, setQrCodePath] = useState(initialData?.qr_code_path || "");
  const [logoPath, setLogoPath] = useState(initialData?.logo_path || "");

  const typeOptions = [
    { value: "bank", label: "Bank" },
    { value: "crypto", label: "Crypto" },
    { value: "other", label: "Other" },
  ];

  const schema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    type: Yup.string().oneOf(["bank", "crypto", "other"]).required("Type is required"),
    beneficiary_name: Yup.string().nullable(),
    bank_name: Yup.string().nullable(),
    branch: Yup.string().nullable(),
    account_number: Yup.string().nullable(),
    ifsc_code: Yup.string().nullable(),
    network: Yup.string().nullable(),
    address: Yup.string().nullable(),
    notes: Yup.string().nullable(),
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      type: "",
      beneficiary_name: "",
      bank_name: "",
      branch: "",
      account_number: "",
      ifsc_code: "",
      network: "",
      address: "",
      notes: "",
      ...(initialData || {}),
    },
  });

  const selectedType = watch("type");

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        type: initialData.type || "",
        beneficiary_name: initialData.beneficiary_name || "",
        bank_name: initialData.bank_name || "",
        branch: initialData.branch || "",
        account_number: initialData.account_number || "",
        ifsc_code: initialData.ifsc_code || "",
        network: initialData.network || "",
        address: initialData.address || "",
        notes: initialData.notes || "",
      });
      setStatus(initialData.status === "active");
      setQrCodePath(initialData.qr_code_path || "");
      setLogoPath(initialData.logo_path || "");
    }
  }, [initialData, reset]);

  useEffect(() => {
    setValue("status", status ? "active" : "inactive");
  }, [status, setValue]);

  const handleFileChange = (e, setFile, setPath) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPath("");
    }
  };

  const removeFile = (setFile, setPath) => {
    setFile(null);
    setPath("");
  };

  const internalSubmit = (data) => {
    data.qr_code = qrCodeFile;
    data.logo = logoFile;
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(internalSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Method Name</label>
        <input
          type="text"
          placeholder="Enter method name"
          {...register("name")}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent bg-white dark:bg-gray-900 text-gray-800 dark:text-white ${
            errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
          }`}
        />
        <p className="text-red-500 text-sm">{errors.name?.message}</p>
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Type</label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={typeOptions}
              placeholder="Select type"
              value={typeOptions.find((opt) => opt.value === field.value) || null}
              onChange={(selected) => field.onChange(selected ? selected.value : "")}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: "var(--tw-bg-white, white)",
                  borderColor: errors.type ? "red" : state.isFocused ? "#86efac" : "#d1d5db",
                  borderRadius: "0.375rem",
                  minHeight: "2.5rem",
                  boxShadow: "none",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "white",
                  color: "black",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "black",
                }),
              }}
              theme={(theme) => ({
                ...theme,
                borderRadius: 6,
                colors: {
                  ...theme.colors,
                  primary25: "#f3f4f6", // hover
                  primary: "#22c55e", // accent
                  neutral0: "white", // input background
                  neutral80: "black", // text color
                },
              })}
            />
          )}
        />
        <p className="text-red-500 text-sm">{errors.type?.message}</p>
      </div>

      {/* Status */}
      <div>
        <Switch isOn={status} onToggle={setStatus} label="Active Status" />
      </div>

      {/* Bank Fields */}
      {selectedType === "bank" && (
        <>
          {[
            { name: "beneficiary_name", label: "Beneficiary Name", placeholder: "Enter beneficiary name" },
            { name: "bank_name", label: "Bank Name", placeholder: "Enter bank name" },
            { name: "branch", label: "Branch", placeholder: "Enter branch" },
            { name: "account_number", label: "Account Number", placeholder: "Enter account number" },
            { name: "ifsc_code", label: "IFSC Code / Swift Code / Agency", placeholder: "Enter code" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{field.label}</label>
              <input
                type="text"
                placeholder={field.placeholder}
                {...register(field.name)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
              />
            </div>
          ))}
        </>
      )}

      {/* Crypto Fields */}
      {selectedType === "crypto" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Network</label>
            <input
              type="text"
              placeholder="Enter network"
              {...register("network")}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Address</label>
            <input
              type="text"
              placeholder="Enter crypto address"
              {...register("address")}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
            />
          </div>

          <StyledFileInput
            label="QR Code"
            preferredSize="Preferred Size 200 × 200"
            file={qrCodeFile}
            filePath={qrCodePath ? `${apiBaseUrl}/${qrCodePath}` : ""}
            onChange={(e) => handleFileChange(e, setQrCodeFile, setQrCodePath)}
            onRemove={() => removeFile(setQrCodeFile, setQrCodePath)}
          />

          <StyledFileInput
            label="Logo"
            preferredSize="Preferred Size 200 × 200"
            file={logoFile}
            filePath={logoPath ? `${apiBaseUrl}/${logoPath}` : ""}
            onChange={(e) => handleFileChange(e, setLogoFile, setLogoPath)}
            onRemove={() => removeFile(setLogoFile, setLogoPath)}
          />
        </>
      )}

      {/* Other Fields */}
      {selectedType === "other" && (
        <>
          <StyledFileInput
            label="QR Code"
            preferredSize="Preferred Size 200 × 200"
            file={qrCodeFile}
            filePath={qrCodePath ? `${apiBaseUrl}/${qrCodePath}` : ""}
            onChange={(e) => handleFileChange(e, setQrCodeFile, setQrCodePath)}
            onRemove={() => removeFile(setQrCodeFile, setQrCodePath)}
          />

          <StyledFileInput
            label="Logo"
            preferredSize="Preferred Size 200 × 200"
            file={logoFile}
            filePath={logoPath ? `${apiBaseUrl}/${logoPath}` : ""}
            onChange={(e) => handleFileChange(e, setLogoFile, setLogoPath)}
            onRemove={() => removeFile(setLogoFile, setLogoPath)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Notes</label>
            <textarea
              placeholder="Enter any additional notes"
              {...register("notes")}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
            ></textarea>
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-accent text-white py-2 rounded font-semibold transition ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/90"
        }`}
      >
        {isSubmitting ? <Spinner color="white" /> : "Save Method"}
      </button>
    </form>
  );
};

export default DepositMethodForm;
