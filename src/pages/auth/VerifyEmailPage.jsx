import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";

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
      <div className="bg-white shadow-2xl rounded-lg p-6 w-full max-w-md mx-auto border border-gray-100 text-center">
        {status === "idle" && (
          <>
            <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
            <p className="mb-4 text-gray-600">Click the button below to verify your email address.</p>
            <button
              onClick={handleVerify}
              className="bg-accent text-white py-2 px-4 rounded font-semibold hover:bg-accent/90 transition"
            >
              Verify Email
            </button>
          </>
        )}

        {status === "loading" && (
          <>
            <div className="flex justify-center items-center h-24">
              <Spinner />
            </div>
            <p className="mt-4 text-gray-600">Verifying your email...</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Email Verified!</h2>
            <p className="mb-4 text-gray-600">{message}</p>
            <button
              onClick={handleGoToLogin}
              className="bg-accent text-white py-2 px-4 rounded font-semibold hover:bg-accent/90 transition"
            >
              Go to Login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
            <p className="mb-4 text-gray-600">{message}</p>
            <button
              onClick={handleGoToLogin}
              className="bg-accent text-white py-2 px-4 rounded font-semibold hover:bg-accent/90 transition"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
