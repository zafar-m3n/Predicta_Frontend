import React, { useState } from "react";
import AuthLayout from "@/layouts/AuthLayout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";
import { useSearchParams, useNavigate } from "react-router-dom";

import TextInput from "@/components/form/TextInput";
import AccentButton from "@/components/ui/AccentButton";

const schema = Yup.object().shape({
  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const ResetPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-6 w-full max-w-md mx-auto border border-gray-100 dark:border-gray-700 transition-all duration-300">
        <h1 className="text-2xl font-bold text-center mb-1 text-gray-800 dark:text-white">
          Reset <span className="text-accent">Your Password</span>
        </h1>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">Enter your new password below.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <TextInput
            type="password"
            placeholder="New Password"
            {...register("password")}
            error={errors.password?.message}
          />

          <TextInput
            type="password"
            placeholder="Confirm New Password"
            {...register("confirm_password")}
            error={errors.confirm_password?.message}
          />

          <AccentButton
            type="submit"
            loading={isSubmitting}
            text="Reset Password"
            spinner={<Spinner color="white" />}
          />

          <p className="text-center text-sm text-gray-700 dark:text-gray-300">
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
