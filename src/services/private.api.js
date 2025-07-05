import instance from "@/lib/axios";

/* ---------- Auth: Register ---------- */
const registerUser = async (data) => {
  return await instance.apiClient.post("/api/v1/auth/register", data, {
    headers: instance.publicHeaders(),
  });
};

/* ---------- Auth: Verify Email ---------- */
const verifyEmail = async (token) => {
  return await instance.apiClient.get(`/api/v1/auth/verify-email?token=${token}`, {
    headers: instance.publicHeaders(),
  });
};

/* ---------- Auth: Login ---------- */
const loginUser = async (data) => {
  return await instance.apiClient.post("/api/v1/auth/login", data, {
    headers: instance.publicHeaders(),
  });
};

/* ---------- Auth: Forgot Password ---------- */
const forgotPassword = async (data) => {
  return await instance.apiClient.post("/api/v1/auth/forgot-password", data, {
    headers: instance.publicHeaders(),
  });
};

/* ---------- Auth: Reset Password ---------- */
const resetPassword = async (token, data) => {
  return await instance.apiClient.post(`/api/v1/auth/reset-password?token=${token}`, data, {
    headers: instance.publicHeaders(),
  });
};

const privateAPI = {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
};

export default privateAPI;
