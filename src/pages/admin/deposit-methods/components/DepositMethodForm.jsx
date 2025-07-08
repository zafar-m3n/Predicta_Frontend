import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Switch from "@/components/ui/Switch";
import StyledFileInput from "@/components/ui/StyledFileInput";

const DepositMethodForm = ({ initialData = null, onSubmit, isSubmitting }) => {
  const [qrCodeFile, setQrCodeFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [status, setStatus] = useState(initialData?.status === "active");

  const typeOptions = ["bank", "crypto", "other"];

  const schema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    type: Yup.string().oneOf(typeOptions).required("Type is required"),
    beneficiary_name: Yup.string().nullable(),
    bank_name: Yup.string().nullable(),
    branch: Yup.string().nullable(),
    account_number: Yup.string().nullable(),
    ifsc_code: Yup.string().nullable(),
    banco: Yup.string().nullable(),
    pix: Yup.string().nullable(),
    network: Yup.string().nullable(),
    address: Yup.string().nullable(),
    notes: Yup.string().nullable(),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      name: "",
      type: "",
      beneficiary_name: "",
      bank_name: "",
      branch: "",
      account_number: "",
      ifsc_code: "",
      banco: "",
      pix: "",
      network: "",
      address: "",
      notes: "",
    },
  });

  const selectedType = watch("type");

  useEffect(() => {
    setValue("status", status ? "active" : "inactive");
  }, [status, setValue]);

  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = (setFile) => {
    setFile(null);
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Method Name</label>
        <input
          type="text"
          placeholder="Enter method name"
          {...register("name")}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />
        <p className="text-red-500 text-sm">{errors.name?.message}</p>
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select
          {...register("type")}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent ${
            errors.type ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select type</option>
          {typeOptions.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
        <p className="text-red-500 text-sm">{errors.type?.message}</p>
      </div>

      {/* Status */}
      <div>
        <Switch isOn={status} onToggle={setStatus} label="Active Status" />
      </div>

      {/* Dynamic fields */}
      {selectedType === "bank" && (
        <>
          {[
            { name: "beneficiary_name", label: "Beneficiary Name", placeholder: "Enter beneficiary name" },
            { name: "bank_name", label: "Bank Name", placeholder: "Enter bank name" },
            { name: "branch", label: "Branch", placeholder: "Enter branch name" },
            { name: "account_number", label: "Account Number", placeholder: "Enter account number" },
            { name: "ifsc_code", label: "IFSC Code", placeholder: "Enter IFSC code" },
            { name: "banco", label: "Banco", placeholder: "Enter banco" },
            { name: "pix", label: "Pix", placeholder: "Enter pix" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                type="text"
                placeholder={field.placeholder}
                {...register(field.name)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent border-gray-300"
              />
            </div>
          ))}
        </>
      )}

      {selectedType === "crypto" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Network</label>
            <input
              type="text"
              placeholder="Enter network"
              {...register("network")}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              placeholder="Enter crypto address"
              {...register("address")}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent border-gray-300"
            />
          </div>

          <StyledFileInput
            label="QR Code"
            preferredSize="Preferred Size 200 × 200"
            file={qrCodeFile}
            onChange={(e) => handleFileChange(e, setQrCodeFile)}
            onRemove={() => removeFile(setQrCodeFile)}
          />

          <StyledFileInput
            label="Logo"
            preferredSize="Preferred Size 200 × 200"
            file={logoFile}
            onChange={(e) => handleFileChange(e, setLogoFile)}
            onRemove={() => removeFile(setLogoFile)}
          />
        </>
      )}

      {selectedType === "other" && (
        <>
          <StyledFileInput
            label="QR Code"
            preferredSize="Preferred Size 200 × 200"
            file={qrCodeFile}
            onChange={(e) => handleFileChange(e, setQrCodeFile)}
            onRemove={() => removeFile(setQrCodeFile)}
          />

          <StyledFileInput
            label="Logo"
            preferredSize="Preferred Size 200 × 200"
            file={logoFile}
            onChange={(e) => handleFileChange(e, setLogoFile)}
            onRemove={() => removeFile(setLogoFile)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              placeholder="Enter any additional notes"
              {...register("notes")}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent border-gray-300"
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
        {isSubmitting ? "Saving..." : "Save Method"}
      </button>
    </form>
  );
};

export default DepositMethodForm;
