import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import StyledFileInput from "@/components/ui/StyledFileInput";

const DepositRequestForm = ({ onSubmit, isSubmitting }) => {
  const [proofFile, setProofFile] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);

  const predefinedAmounts = [100, 200, 500, 1000];

  const schema = Yup.object().shape({
    amount: Yup.number()
      .typeError("Amount must be a number")
      .required("Amount is required")
      .positive("Amount must be positive"),
    transaction_reference: Yup.string().required("Transaction reference is required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: "",
      transaction_reference: "",
    },
  });

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    if (amount !== "other") {
      setValue("amount", amount);
    } else {
      setValue("amount", "");
    }
  };

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
    <form onSubmit={handleSubmit(internalSubmit)} className="space-y-6 bg-white shadow-lg rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-800">Submit Deposit Request</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Amount</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {predefinedAmounts.map((amt) => (
            <button
              type="button"
              key={amt}
              onClick={() => handleAmountSelect(amt)}
              className={`border rounded-lg py-2 font-semibold transition-all ${
                selectedAmount === amt
                  ? "bg-accent text-white border-accent"
                  : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              ${amt}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleAmountSelect("other")}
            className={`border rounded-lg py-2 font-semibold transition-all ${
              selectedAmount === "other"
                ? "bg-accent text-white border-accent"
                : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Other
          </button>
        </div>
      </div>

      {selectedAmount === "other" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Enter Custom Amount (USD)</label>
          <input
            type="text"
            placeholder="e.g., 150"
            {...register("amount")}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent ${
              errors.amount ? "border-red-500" : "border-gray-300"
            }`}
          />
          <p className="text-red-500 text-sm">{errors.amount?.message}</p>
        </div>
      )}

      <StyledFileInput
        label="Proof of Payment"
        preferredSize="Max size: 5MB"
        file={proofFile}
        onChange={handleFileChange}
        onRemove={removeFile}
      />

      {/* Transaction Reference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Reference</label>
        <input
          type="text"
          placeholder="Enter transaction reference number"
          {...register("transaction_reference")}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent ${
            errors.transaction_reference ? "border-red-500" : "border-gray-300"
          }`}
        />
        <p className="text-red-500 text-sm">{errors.transaction_reference?.message}</p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-accent text-white py-2 rounded-md font-semibold shadow transition-all ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/90"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
};

export default DepositRequestForm;
