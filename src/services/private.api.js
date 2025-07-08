import instance from "@/lib/axios";

/* ========================== */
/* User: Auth Functions       */
/* ========================== */

const registerUser = async (data) => {
  return await instance.apiClient.post("/api/v1/auth/register", data, {
    headers: instance.publicHeaders(),
  });
};

const verifyEmail = async (token) => {
  return await instance.apiClient.get(`/api/v1/auth/verify-email?token=${token}`, {
    headers: instance.publicHeaders(),
  });
};

const loginUser = async (data) => {
  return await instance.apiClient.post("/api/v1/auth/login", data, {
    headers: instance.publicHeaders(),
  });
};

const forgotPassword = async (data) => {
  return await instance.apiClient.post("/api/v1/auth/forgot-password", data, {
    headers: instance.publicHeaders(),
  });
};

const resetPassword = async (token, data) => {
  return await instance.apiClient.post(`/api/v1/auth/reset-password?token=${token}`, data, {
    headers: instance.publicHeaders(),
  });
};

/* ========================== */
/* Admin: Deposit Methods     */
/* ========================== */

const createDepositMethod = async (formData) => {
  return await instance.apiClient.post("/api/v1/admin/deposit-methods", formData, {
    headers: instance.defaultHeaders("multipart/form-data"),
  });
};

const getAllDepositMethods = async () => {
  return await instance.apiClient.get("/api/v1/admin/deposit-methods", {
    headers: instance.defaultHeaders(),
  });
};

const getDepositMethodById = async (id) => {
  return await instance.apiClient.get(`/api/v1/admin/deposit-methods/${id}`, {
    headers: instance.defaultHeaders(),
  });
};

const updateDepositMethod = async (id, formData) => {
  return await instance.apiClient.put(`/api/v1/admin/deposit-methods/${id}`, formData, {
    headers: instance.defaultHeaders("multipart/form-data"),
  });
};

const toggleDepositMethodStatus = async (id, status) => {
  return await instance.apiClient.patch(
    `/api/v1/admin/deposit-methods/${id}/status`,
    { status },
    {
      headers: instance.defaultHeaders(),
    }
  );
};

const privateAPI = {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,

  createDepositMethod,
  getAllDepositMethods,
  getDepositMethodById,
  updateDepositMethod,
  toggleDepositMethodStatus,
};

export default privateAPI;
