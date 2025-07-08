import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import StyledFileInput from "@/components/ui/StyledFileInput";

const DepositRequestForm = ({ onSubmit, isSubmitting }) => {
  const [proofFile, setProofFile] = useState(null);

  const schema = Yup.object().shape({
    amount: Yup.number()
      .typeError("Amount must be a number")
      .required("Amount is required")
      .positive("Amount must be positive"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: "",
    },
  });

  const internalSubmit = (data) => {
    data.proof = proofFile;
    onSubmit(data);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setProofFile(null);
  };

  return (
    <form onSubmit={handleSubmit(internalSubmit)} className="space-y-4 bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Submit Deposit Request</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
        <input
          type="text"
          placeholder="Enter amount"
          {...register("amount")}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent ${
            errors.amount ? "border-red-500" : "border-gray-300"
          }`}
        />
        <p className="text-red-500 text-sm">{errors.amount?.message}</p>
      </div>

      <StyledFileInput
        label="Proof of Payment"
        preferredSize="Max size: 5MB"
        file={proofFile}
        onChange={handleFileChange}
        onRemove={removeFile}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-accent text-white py-2 rounded font-semibold transition ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/90"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
};

export default DepositRequestForm;
