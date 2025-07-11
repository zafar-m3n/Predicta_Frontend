import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Icon from "@/components/ui/Icon";

const schema = Yup.object().shape({
  current_password: Yup.string().required("Current password is required"),
  new_password: Yup.string().min(6, "Minimum 6 characters").required("New password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("new_password"), null], "Passwords must match")
    .required("Please confirm your new password"),
});

const ChangePasswordForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await API.private.changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
      });

      if (res.status === 200) {
        Notification.success(res.data.message || "Password changed successfully!");
        reset();
      }
    } catch (error) {
      const status = error.response?.status;
      let msg = "Something went wrong. Please try again.";

      if (status === 400 || status === 404) {
        msg = error.response?.data?.message || "Invalid data provided.";
      } else if (status === 500) {
        msg = "Server error. Please try again later.";
      }

      Notification.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100 w-full">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Current Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type={showCurrent ? "text" : "password"}
            placeholder="Enter current password"
            {...register("current_password")}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent ${
              errors.current_password ? "border-red-500" : "border-gray-300"
            }`}
          />
          <span
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-1/2 cursor-pointer text-gray-500"
          >
            <Icon icon={showCurrent ? "mdi:eye-off" : "mdi:eye"} width="20" />
          </span>
          <p className="text-red-500 text-sm">{errors.current_password?.message}</p>
        </div>

        {/* New Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type={showNew ? "text" : "password"}
            placeholder="Enter new password"
            {...register("new_password")}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent ${
              errors.new_password ? "border-red-500" : "border-gray-300"
            }`}
          />
          <span
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-1/2 cursor-pointer text-gray-500"
          >
            <Icon icon={showNew ? "mdi:eye-off" : "mdi:eye"} width="20" />
          </span>
          <p className="text-red-500 text-sm">{errors.new_password?.message}</p>
        </div>

        {/* Confirm New Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter new password"
            {...register("confirm_password")}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent ${
              errors.confirm_password ? "border-red-500" : "border-gray-300"
            }`}
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 cursor-pointer text-gray-500"
          >
            <Icon icon={showConfirm ? "mdi:eye-off" : "mdi:eye"} width="20" />
          </span>
          <p className="text-red-500 text-sm">{errors.confirm_password?.message}</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-accent text-white py-2 rounded font-semibold transition ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/90"
          }`}
        >
          {isSubmitting ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
