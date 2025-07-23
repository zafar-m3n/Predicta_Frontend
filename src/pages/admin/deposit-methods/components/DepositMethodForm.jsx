import React, { useState, useEffect, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Switch from "@/components/ui/Switch";
import StyledFileInput from "@/components/ui/StyledFileInput";
import Spinner from "@/components/ui/Spinner";
import { ThemeContext } from "@/context/ThemeContext";
import TextInput from "@/components/form/TextInput";
import Select from "@/components/form/Select";

const apiBaseUrl = import.meta.env.VITE_TRADERSROOM_API_BASEURL;

const DepositMethodForm = ({ initialData = null, onSubmit, isSubmitting }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

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
      <TextInput
        label="Method Name"
        placeholder="Enter method name"
        error={errors.name?.message}
        {...register("name")}
      />

      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <Select
            value={field.value}
            onChange={field.onChange}
            options={typeOptions}
            placeholder="Select type"
            error={errors.type?.message}
          />
        )}
      />

      <Switch isOn={status} onToggle={setStatus} label="Active Status" />

      {selectedType === "bank" && (
        <>
          <TextInput label="Beneficiary Name" placeholder="Enter beneficiary name" {...register("beneficiary_name")} />
          <TextInput label="Bank Name" placeholder="Enter bank name" {...register("bank_name")} />
          <TextInput label="Branch" placeholder="Enter branch" {...register("branch")} />
          <TextInput label="Account Number" placeholder="Enter account number" {...register("account_number")} />
          <TextInput label="IFSC Code / Swift Code / Agency" placeholder="Enter code" {...register("ifsc_code")} />
        </>
      )}

      {selectedType === "crypto" && (
        <>
          <TextInput label="Network" placeholder="Enter network" {...register("network")} />
          <TextInput label="Address" placeholder="Enter crypto address" {...register("address")} />
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
