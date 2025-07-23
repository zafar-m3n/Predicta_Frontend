import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import Select from "@/components/form/Select";
import TextInput from "@/components/form/TextInput";
import AccentButton from "@/components/ui/AccentButton";
import Spinner from "@/components/ui/Spinner";
import Heading from "@/components/ui/Heading";

const WithdrawalRequestForm = ({ methods, onSubmit, isSubmitting, balance }) => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const predefinedAmounts = [100, 200, 500, 1000];

  const schema = Yup.object().shape({
    method_id: Yup.number().required("Withdrawal method is required"),
    amount: Yup.number()
      .typeError("Amount must be a number")
      .required("Amount is required")
      .positive("Amount must be positive")
      .max(balance, "Amount cannot exceed wallet balance"),
    note: Yup.string().max(255, "Note must be at most 255 characters"),
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      method_id: null,
      amount: "",
      note: "",
    },
  });

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setValue("amount", amount !== "other" ? amount : "");
  };

  const internalSubmit = (data) => {
    onSubmit({
      method_id: data.method_id,
      amount: data.amount,
      note: data.note || null,
    });
  };

  const methodOptions = methods.map((method) => ({
    value: method.id,
    label: method.type === "bank" ? `${method.bank_name} (${method.account_number})` : `${method.network} Wallet`,
  }));

  return (
    <form
      onSubmit={handleSubmit(internalSubmit)}
      className="space-y-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6"
    >
      <Heading>Submit Withdrawal Request</Heading>

      <Controller
        name="method_id"
        control={control}
        render={({ field }) => (
          <Select
            label="Select Withdrawal Method"
            options={methodOptions}
            value={field.value}
            onChange={(val) => field.onChange(val)}
            error={errors.method_id?.message}
            placeholder="Choose a method..."
          />
        )}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Amount</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {predefinedAmounts.map((amt) => (
            <button
              key={amt}
              type="button"
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

      <TextInput
        label="Note (Optional)"
        placeholder="Any note you want to add"
        type="text"
        {...register("note")}
        error={errors.note?.message}
      />

      <AccentButton type="submit" text="Submit Request" loading={isSubmitting} spinner={<Spinner color="white" />} />
    </form>
  );
};

export default WithdrawalRequestForm;
