import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import RegisterPage from "@/pages/auth/RegisterPage";
import LoginPage from "@/pages/auth/LoginPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";

import DashboardPage from "@/pages/client/dashboard";
import DepositsPage from "@/pages/client/deposits";
import DepositRequestPage from "@/pages/client/deposits/DepositRequest";
import WithdrawalsPage from "@/pages/client/withdrawals";
import WalletHistoryPage from "@/pages/client/wallet-history";
import TicketsPage from "@/pages/client/tickets";
import MarketEventsPage from "@/pages/client/market-events";
import ProfilePage from "@/pages/client/profile";

import AdminDashboardPage from "@/pages/admin/dashboard";
import Documents from "@/pages/admin/documents";
import DepositRequestsPage from "@/pages/admin/deposit-requests";
import DepositMethodsPage from "@/pages/admin/deposit-methods";
import AddOrEditDepositMethod from "@/pages/admin/deposit-methods/AddOrEditDepositMethod";
import WithdrawalRequestsPage from "@/pages/admin/withdrawal-requests";
import UsersPage from "@/pages/admin/users";
import ViewUser from "@/pages/admin/users/ViewUser";
import SettingsPage from "@/pages/admin/settings";

import PrivateRoute from "@/components/PrivateRoute";
import PublicRoute from "@/components/PublicRoute";
import token from "@/lib/utilities";

function App() {
  const clientRoutes = [
    { path: "/dashboard", element: DashboardPage },
    { path: "/deposits", element: DepositsPage },
    { path: "/deposits/new/:methodId", element: DepositRequestPage },
    { path: "/withdrawals", element: WithdrawalsPage },
    { path: "/wallet-history", element: WalletHistoryPage },
    { path: "/tickets", element: TicketsPage },
    { path: "/market-events", element: MarketEventsPage },
    { path: "/profile", element: ProfilePage },
  ];

  const adminRoutes = [
    { path: "/admin/dashboard", element: AdminDashboardPage },
    { path: "/admin/documents", element: Documents },
    { path: "/admin/deposit-requests", element: DepositRequestsPage },
    { path: "/admin/deposit-methods", element: DepositMethodsPage },
    { path: "/admin/deposit-methods/new", element: AddOrEditDepositMethod },
    { path: "/admin/deposit-methods/:id/edit", element: AddOrEditDepositMethod },
    { path: "/admin/withdrawal-requests", element: WithdrawalRequestsPage },
    { path: "/admin/users", element: UsersPage },
    { path: "/admin/users/:id", element: ViewUser },
    { path: "/admin/settings", element: SettingsPage },
  ];

  const publicRoutes = [
    { path: "/register", element: RegisterPage },
    { path: "/login", element: LoginPage },
    { path: "/verify-email", element: VerifyEmailPage },
    { path: "/forgot-password", element: ForgotPasswordPage },
    { path: "/reset-password", element: ResetPasswordPage },
  ];

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              token.isAuthenticated() ? (
                token.getUserData()?.role === "admin" ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {clientRoutes.map((route, idx) => (
            <Route
              key={idx}
              path={route.path}
              element={
                <PrivateRoute>
                  <route.element />
                </PrivateRoute>
              }
            />
          ))}

          {adminRoutes.map((route, idx) => (
            <Route
              key={idx}
              path={route.path}
              element={
                <PrivateRoute>
                  <route.element />
                </PrivateRoute>
              }
            />
          ))}

          {publicRoutes.map((route, idx) => (
            <Route
              key={idx}
              path={route.path}
              element={
                <PublicRoute>
                  <route.element />
                </PublicRoute>
              }
            />
          ))}
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={true}
        closeOnClick={true}
        draggable={false}
        pauseOnHover={true}
      />
    </>
  );
}

export default App;
