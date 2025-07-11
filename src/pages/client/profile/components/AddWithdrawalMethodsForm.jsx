import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";

const schema = Yup.object().shape({
  type: Yup.string().required(),
  bank_name: Yup.string().when("type", {
    is: "bank",
    then: Yup.string().required("Bank name is required"),
  }),
  branch: Yup.string().when("type", {
    is: "bank",
    then: Yup.string().required("Branch is required"),
  }),
  account_number: Yup.string().when("type", {
    is: "bank",
    then: Yup.string().required("Account number is required"),
  }),
  account_name: Yup.string().when("type", {
    is: "bank",
    then: Yup.string().required("Account name is required"),
  }),
  swift_code: Yup.string(),
  iban: Yup.string(),
  network: Yup.string().when("type", {
    is: "crypto",
    then: Yup.string().required("Network is required"),
  }),
  wallet_address: Yup.string().when("type", {
    is: "crypto",
    then: Yup.string().required("Wallet address is required"),
  }),
});

const AddWithdrawalMethodForm = ({ type, onSuccess, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { type },
  });

  const onSubmit = async (data) => {
    try {
      const res = await API.private.addWithdrawalMethod(data);

      if (res.status === 201) {
        Notification.success(res.data.message || "Withdrawal method added successfully!");
        reset();
        onSuccess();
        onClose();
      }
    } catch (error) {
      let msg = "Something went wrong. Please try again.";
      if (error.response?.data?.message) {
        msg = error.response.data.message;
      }
      Notification.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {type === "bank" && (
        <>
          <input
            type="text"
            placeholder="Bank Name"
            {...register("bank_name")}
            className={`w-full border rounded px-3 py-2 focus:outline-none ${
              errors.bank_name ? "border-red-500" : "border-gray-300"
            }`}
          />
          <p className="text-red-500 text-sm">{errors.bank_name?.message}</p>

          <input
            type="text"
            placeholder="Branch"
            {...register("branch")}
            className={`w-full border rounded px-3 py-2 focus:outline-none ${
              errors.branch ? "border-red-500" : "border-gray-300"
            }`}
          />
          <p className="text-red-500 text-sm">{errors.branch?.message}</p>

          <input
            type="text"
            placeholder="Account Number"
            {...register("account_number")}
            className={`w-full border rounded px-3 py-2 focus:outline-none ${
              errors.account_number ? "border-red-500" : "border-gray-300"
            }`}
          />
          <p className="text-red-500 text-sm">{errors.account_number?.message}</p>

          <input
            type="text"
            placeholder="Account Name"
            {...register("account_name")}
            className={`w-full border rounded px-3 py-2 focus:outline-none ${
              errors.account_name ? "border-red-500" : "border-gray-300"
            }`}
          />
          <p className="text-red-500 text-sm">{errors.account_name?.message}</p>

          <input
            type="text"
            placeholder="SWIFT Code (optional)"
            {...register("swift_code")}
            className="w-full border rounded px-3 py-2 focus:outline-none border-gray-300"
          />

          <input
            type="text"
            placeholder="IBAN (optional)"
            {...register("iban")}
            className="w-full border rounded px-3 py-2 focus:outline-none border-gray-300"
          />
        </>
      )}

      {type === "crypto" && (
        <>
          <input
            type="text"
            placeholder="Network"
            {...register("network")}
            className={`w-full border rounded px-3 py-2 focus:outline-none ${
              errors.network ? "border-red-500" : "border-gray-300"
            }`}
          />
          <p className="text-red-500 text-sm">{errors.network?.message}</p>

          <input
            type="text"
            placeholder="Wallet Address"
            {...register("wallet_address")}
            className={`w-full border rounded px-3 py-2 focus:outline-none ${
              errors.wallet_address ? "border-red-500" : "border-gray-300"
            }`}
          />
          <p className="text-red-500 text-sm">{errors.wallet_address?.message}</p>
        </>
      )}

      <button
        type="submit"
        className="w-full bg-accent text-white py-2 rounded font-semibold hover:bg-accent/90 transition"
      >
        Add Method
      </button>
    </form>
  );
};

export default AddWithdrawalMethodForm;
