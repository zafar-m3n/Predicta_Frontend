import React, { useState } from "react";
import AuthLayout from "@/layouts/AuthLayout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import token from "@/lib/utilities";
import Icon from "@/components/ui/Icon";
import { useNavigate } from "react-router-dom";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
      const res = await API.private.loginUser({
        email: data.email,
        password: data.password,
      });

      if (res.data.code === "OK") {
        Notification.success(res.data.data?.message || "Login successful!");

        token.setAuthToken(res.data.data.token);
        token.setUserData(res.data.data.user);

        const userData = res.data.data.user;
        if (userData.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        Notification.error(res.data.error || "Unexpected response from server.");
      }
    } catch (error) {
      const status = error.response?.status;
      let msg = "Login failed. Please try again.";

      if (status === 400) {
        msg = error.response?.data?.error || "Invalid email or password.";
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
          Welcome Back to <span className="text-accent">EQUITYFX</span>
        </h1>

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

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
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

          <div className="flex justify-end text-sm">
            <a href="/forgot-password" className="text-accent font-medium">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-accent text-white py-2 rounded font-semibold transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/90"
            }`}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm">
            Don't have an account?{" "}
            <a href="/register" className="text-accent font-medium">
              Register
            </a>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
