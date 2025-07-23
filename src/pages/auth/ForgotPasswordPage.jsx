import React, { useState } from "react";
import AuthLayout from "@/layouts/AuthLayout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";
import TextInput from "@/components/form/TextInput";
import AccentButton from "@/components/ui/AccentButton";

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

      if (res.data.code === "OK") {
        Notification.success(res.data.data?.message || "Password reset email sent!");
      } else {
        Notification.error(res.data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      const status = error.response?.status;
      let msg = "Something went wrong. Please try again.";

      if (status === 400) {
        msg = error.response?.data?.error || "Invalid email.";
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
          Forgot Your <span className="text-accent">Password?</span>
        </h1>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          Enter your email to receive a reset link.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <TextInput type="email" placeholder="Enter Your Email" {...register("email")} error={errors.email?.message} />

          <AccentButton
            type="submit"
            loading={isSubmitting}
            text="Send Reset Link"
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

export default ForgotPasswordPage;
