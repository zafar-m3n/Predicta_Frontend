import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Switch from "@/components/ui/Switch";
import Icon from "@/components/ui/Icon";

const DepositMethodForm = ({ initialData = null, onSubmit, isSubmitting }) => {
  // Local state for files
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

  // Sync status field
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
    // Attach files to data
    data.qr_code = qrCodeFile;
    data.logo = logoFile;
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(internalSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <input
          type="text"
          placeholder="Method Name"
          {...register("name")}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />
        <p className="text-red-500 text-sm">{errors.name?.message}</p>
      </div>

      {/* Type */}
      <div>
        <select
          {...register("type")}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent ${
            errors.type ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Type</option>
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
          <input
            type="text"
            placeholder="Beneficiary Name"
            {...register("beneficiary_name")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent border-gray-300"
          />
          <input
            type="text"
            placeholder="Bank Name"
            {...register("bank_name")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent border-gray-300"
          />
          <input
            type="text"
            placeholder="Branch"
            {...register("branch")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent border-gray-300"
          />
          <input
            type="text"
            placeholder="Account Number"
            {...register("account_number")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent border-gray-300"
          />
          <input
            type="text"
            placeholder="IFSC Code"
            {...register("ifsc_code")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent border-gray-300"
          />
          <input
            type="text"
            placeholder="Banco"
            {...register("banco")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent border-gray-300"
          />
          <input
            type="text"
            placeholder="Pix"
            {...register("pix")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent border-gray-300"
          />
        </>
      )}

      {selectedType === "crypto" && (
        <>
          <input
            type="text"
            placeholder="Network"
            {...register("network")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent border-gray-300"
          />
          <input
            type="text"
            placeholder="Address"
            {...register("address")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent border-gray-300"
          />

          {/* QR Code Upload */}
          <div>
            {!qrCodeFile ? (
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setQrCodeFile)} />
            ) : (
              <div className="border rounded p-3 flex items-center justify-between">
                <span className="text-sm truncate">{qrCodeFile.name}</span>
                <button type="button" onClick={() => removeFile(setQrCodeFile)}>
                  <Icon icon="mdi:close" width="18" />
                </button>
              </div>
            )}
          </div>

          {/* Logo Upload */}
          <div>
            {!logoFile ? (
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setLogoFile)} />
            ) : (
              <div className="border rounded p-3 flex items-center justify-between">
                <span className="text-sm truncate">{logoFile.name}</span>
                <button type="button" onClick={() => removeFile(setLogoFile)}>
                  <Icon icon="mdi:close" width="18" />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {selectedType === "other" && (
        <>
          {/* QR Code Upload */}
          <div>
            {!qrCodeFile ? (
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setQrCodeFile)} />
            ) : (
              <div className="border rounded p-3 flex items-center justify-between">
                <span className="text-sm truncate">{qrCodeFile.name}</span>
                <button type="button" onClick={() => removeFile(setQrCodeFile)}>
                  <Icon icon="mdi:close" width="18" />
                </button>
              </div>
            )}
          </div>

          {/* Logo Upload */}
          <div>
            {!logoFile ? (
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setLogoFile)} />
            ) : (
              <div className="border rounded p-3 flex items-center justify-between">
                <span className="text-sm truncate">{logoFile.name}</span>
                <button type="button" onClick={() => removeFile(setLogoFile)}>
                  <Icon icon="mdi:close" width="18" />
                </button>
              </div>
            )}
          </div>

          <textarea
            placeholder="Notes"
            {...register("notes")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-accent border-gray-300"
          ></textarea>
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
