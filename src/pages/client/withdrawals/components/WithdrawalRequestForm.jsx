import React, { useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Select from "react-select";
import Spinner from "@/components/ui/Spinner";
import { ThemeContext } from "@/context/ThemeContext";

// Custom react-select styles based on theme and error
const getSelectStyles = (theme, hasError) => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
    borderColor: hasError ? "#f87171" : base.borderColor,
    color: theme === "dark" ? "#f9fafb" : "#111827",
    boxShadow: state.isFocused ? "0 0 0 1px var(--tw-ring-color)" : base.boxShadow,
    "&:hover": {
      borderColor: theme === "dark" ? "#9ca3af" : "#6b7280",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
    zIndex: 50,
  }),
  singleValue: (base) => ({
    ...base,
    color: theme === "dark" ? "#f9fafb" : "#111827",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#2563eb"
      : state.isFocused
      ? theme === "dark"
        ? "#374151"
        : "#f3f4f6"
      : theme === "dark"
      ? "#1f2937"
      : "#ffffff",
    color: theme === "dark" ? "#f9fafb" : "#111827",
    cursor: "pointer",
  }),
  placeholder: (base) => ({
    ...base,
    color: theme === "dark" ? "#9ca3af" : "#6b7280",
  }),
});

const WithdrawalRequestForm = ({ methods, onSubmit, isSubmitting, balance }) => {
  const { theme } = useContext(ThemeContext);
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
      method_id: methods[0]?.id || null,
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
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Submit Withdrawal Request</h2>

      {/* Select Withdrawal Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Select Withdrawal Method
        </label>
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
              styles={getSelectStyles(theme, !!errors.method_id)}
            />
          )}
        />
        <p className="text-red-500 text-sm">{errors.method_id?.message}</p>
      </div>

      {/* Select or Enter Amount */}
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
                  : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Other
          </button>
        </div>
      </div>

      {/* Custom Amount Input */}
      {selectedAmount === "other" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Enter Custom Amount (USD)
          </label>
          <input
            type="text"
            placeholder="e.g., 150"
            {...register("amount")}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
              errors.amount ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            }`}
          />
          <p className="text-red-500 text-sm">{errors.amount?.message}</p>
        </div>
      )}

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Note (Optional)</label>
        <textarea
          {...register("note")}
          placeholder="Any note you want to add"
          rows={3}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
            errors.note ? "border-red-500" : "border-gray-300 dark:border-gray-700"
          }`}
        />
        <p className="text-red-500 text-sm">{errors.note?.message}</p>
      </div>

      {/* Submit */}
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
