import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";
import AccentButton from "@/components/ui/AccentButton";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle"); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState("");

  const handleVerify = async () => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    setStatus("loading");

    setTimeout(async () => {
      try {
        const res = await API.private.verifyEmail(token);

        if (res.data.code === "OK") {
          setStatus("success");
          setMessage(res.data.data?.message || "Your email has been verified successfully!");
        } else {
          setStatus("error");
          const errMsg = res.data.error || "Verification failed. Please try again.";
          setMessage(errMsg);
          Notification.error(errMsg);
        }
      } catch (error) {
        const statusCode = error.response?.status;
        let msg = "Verification failed. Please try again.";

        if (statusCode === 400) {
          msg = error.response?.data?.error || "Invalid or expired verification token.";
        } else if (statusCode === 500) {
          msg = "Server error. Please try again later.";
        }

        setStatus("error");
        setMessage(msg);
        Notification.error(msg);
      }
    }, 2000);
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <AuthLayout>
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-6 w-full max-w-md mx-auto border border-gray-100 dark:border-gray-700 transition-all duration-300">
        {status === "idle" && (
          <>
            <h1 className="text-2xl font-bold text-center mb-1 text-gray-800 dark:text-white">
              Verify <span className="text-accent">Your Email</span>{" "}
            </h1>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              Click the button below to verify your email address.
            </p>
            <AccentButton onClick={handleVerify} text="Verify Email" />
          </>
        )}

        {status === "loading" && (
          <>
            <Spinner />
            <p className="mt-4 text-gray-500">Verifying your email...</p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-center text-accent">Email Verified!</h1>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">{message}</p>
            <AccentButton onClick={handleGoToLogin} text="Go to Login" />
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-center text-red-600 dark:text-red-400">Verification Failed!</h1>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">{message}</p>
            <AccentButton onClick={handleGoToLogin} text="Go to Login" />
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
