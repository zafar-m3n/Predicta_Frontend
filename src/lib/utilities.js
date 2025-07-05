const getAuthToken = () => {
  return localStorage.getItem("tradersroom.token");
};

const setAuthToken = (authToken) => {
  localStorage.setItem("tradersroom.token", authToken);
};

const removeAuthToken = () => {
  localStorage.removeItem("tradersroom.token");
};

const getUserData = () => {
  const userData = localStorage.getItem("tradersroom.user");
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

const setUserData = (userData) => {
  localStorage.setItem("tradersroom.user", JSON.stringify(userData));
};

const removeUserData = () => {
  localStorage.removeItem("tradersroom.user");
};

const token = {
  getAuthToken,
  setAuthToken,
  removeAuthToken,

  getUserData,
  setUserData,
  removeUserData,
};

export default token;
