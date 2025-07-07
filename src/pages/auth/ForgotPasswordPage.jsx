import React, { useState } from "react";
import AuthLayout from "@/layouts/AuthLayout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await API.private.forgotPassword(data);
      Notification.success(res.data.message || "Password reset email sent!");
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong. Please try again.";
      Notification.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white shadow-2xl rounded-lg p-6 w-full max-w-md mx-auto border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-1">
          Forgot Your <span className="text-accent">Password?</span>
        </h1>
        <p className="text-center text-sm text-gray-500 mb-4">Enter your email to receive a reset link.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <input
              type="email"
              placeholder="Enter Your Email"
              {...register("email")}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:border-accent ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-accent text-white py-2 rounded font-semibold transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/90"
            }`}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
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

export default ForgotPasswordPage;
