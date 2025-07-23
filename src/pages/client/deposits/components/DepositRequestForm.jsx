import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import TextInput from "@/components/form/TextInput";
import AccentButton from "@/components/ui/AccentButton";
import StyledFileInput from "@/components/ui/StyledFileInput";
import Spinner from "@/components/ui/Spinner";
import Heading from "@/components/ui/Heading";

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
    <form
      onSubmit={handleSubmit(internalSubmit)}
      className="space-y-4 bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6"
    >
      <Heading>Submit Deposit Request</Heading>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Amount</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {predefinedAmounts.map((amt) => (
            <button
              type="button"
              key={amt}
              onClick={() => handleAmountSelect(amt)}
              className={`border rounded-lg py-2 font-semibold transition-all ${
                selectedAmount === amt
                  ? "bg-accent text-white border-accent"
                  : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
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
                : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
            }`}
          >
            Other
          </button>
        </div>
      </div>

      {selectedAmount === "other" && (
        <TextInput
          label="Enter Custom Amount (USD)"
          placeholder="e.g., 150"
          type="text"
          error={errors.amount?.message}
          {...register("amount")}
        />
      )}

      <StyledFileInput
        label="Proof of Payment"
        preferredSize="Max size: 5MB"
        file={proofFile}
        onChange={handleFileChange}
        onRemove={removeFile}
      />

      <TextInput
        label="Transaction Reference"
        placeholder="Enter transaction reference number"
        type="text"
        error={errors.transaction_reference?.message}
        {...register("transaction_reference")}
      />

      <AccentButton type="submit" text="Submit Request" loading={isSubmitting} spinner={<Spinner color="white" />} />
    </form>
  );
};

export default DepositRequestForm;
