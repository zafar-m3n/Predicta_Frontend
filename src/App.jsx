import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import RegisterPage from "@/pages/auth/RegisterPage";
import LoginPage from "@/pages/auth/LoginPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import DepositMethods from "@/pages/admin/deposit-methods";
import DashboardPage from "@/pages/client/dashboard";
import DepositsPage from "@/pages/client/deposits";
import WithdrawalsPage from "@/pages/client/withdrawals";
import WalletHistoryPage from "@/pages/client/wallet-history";
import TicketsPage from "@/pages/client/tickets";
import MarketEventsPage from "@/pages/client/market-events";
import ProfilePage from "@/pages/client/profile";

import PrivateRoute from "@/components/PrivateRoute";
import PublicRoute from "@/components/PublicRoute";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Client private routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/deposits"
            element={
              <PrivateRoute>
                <DepositsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/withdrawals"
            element={
              <PrivateRoute>
                <WithdrawalsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/wallet-history"
            element={
              <PrivateRoute>
                <WalletHistoryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/tickets"
            element={
              <PrivateRoute>
                <TicketsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/market-events"
            element={
              <PrivateRoute>
                <MarketEventsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* Admin private route */}
          <Route
            path="/admin/deposit-methods"
            element={
              <PrivateRoute>
                <DepositMethods />
              </PrivateRoute>
            }
          />

          {/* Public routes */}
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              <PublicRoute>
                <VerifyEmailPage />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            }
          />
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        closeOnClick={true}
        draggable={false}
        pauseOnHover={true}
        theme="colored"
      />
    </>
  );
}

export default App;
