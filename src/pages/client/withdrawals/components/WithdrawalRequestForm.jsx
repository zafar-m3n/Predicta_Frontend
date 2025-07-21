import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Select from "react-select";
import Spinner from "@/components/ui/Spinner";

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
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      method_id: methods[0]?.id || null,
      amount: "",
      note: "",
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
    <form onSubmit={handleSubmit(internalSubmit)} className="space-y-6 bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-gray-800">Submit Withdrawal Request</h2>

      {/* Select Withdrawal Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Withdrawal Method</label>
        <Controller
          name="method_id"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={methodOptions}
              placeholder="Choose a method..."
              classNamePrefix="react-select"
              onChange={(option) => field.onChange(option.value)}
              value={methodOptions.find((opt) => opt.value === field.value) || null}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: errors.method_id ? "#f87171" : base.borderColor,
                }),
              }}
            />
          )}
        />
        <p className="text-red-500 text-sm">{errors.method_id?.message}</p>
      </div>

      {/* Select or Enter Amount */}
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

      {/* Optional Note */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
        <textarea
          {...register("note")}
          placeholder="Any note you want to add"
          rows={3}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent ${
            errors.note ? "border-red-500" : "border-gray-300"
          }`}
        />
        <p className="text-red-500 text-sm">{errors.note?.message}</p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-accent text-white py-2 rounded-md font-semibold shadow transition-all ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/90"
        } flex justify-center items-center gap-2`}
      >
        {isSubmitting ? <Spinner color="white" /> : "Submit Request"}
      </button>
    </form>
  );
};

export default WithdrawalRequestForm;
