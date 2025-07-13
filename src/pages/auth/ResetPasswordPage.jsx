import React, { useState } from "react";
import AuthLayout from "@/layouts/AuthLayout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Icon from "@/components/ui/Icon";
import { useSearchParams, useNavigate } from "react-router-dom";
import Spinner from "@/components/ui/Spinner";

const schema = Yup.object().shape({
  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const ResetPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!token) {
      Notification.error("Missing or invalid token.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await API.private.resetPassword(token, { password: data.password });

      if (res.data.code === "OK") {
        Notification.success(res.data.data?.message || "Password reset successfully! You can now log in.");
        navigate("/login");
      } else {
        Notification.error(res.data.error || "Unexpected error occurred.");
      }
    } catch (error) {
      const status = error.response?.status;
      let msg = "Something went wrong. Please try again.";

      if (status === 400) {
        msg = error.response?.data?.error || "Invalid or expired reset token.";
      } else if (status === 500) {
        msg = "Server error. Please try again later.";
      }

      Notification.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white shadow-2xl rounded-lg p-6 w-full max-w-md mx-auto border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-1">
          Reset <span className="text-accent">Your Password</span>
        </h1>
        <p className="text-center text-sm text-gray-500 mb-4">Enter your new password below.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              {...register("password")}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} width="20" />
            </span>
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              {...register("confirm_password")}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent ${
                errors.confirm_password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              <Icon icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"} width="20" />
            </span>
            <p className="text-red-500 text-sm">{errors.confirm_password?.message}</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-accent text-white py-2 rounded font-semibold transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/90"
            } flex justify-center items-center gap-2`}
          >
            {isSubmitting ? <Spinner color="white" /> : "Reset Password"}
          </button>

          <p className="text-center text-sm">
            Remembered your password?{" "}
            <a href="/login" className="text-accent font-medium">
              Login
            </a>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
