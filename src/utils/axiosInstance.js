import axios from "axios";
import jwt from "jwt-decode";
import dayjs from "dayjs";
const { REACT_APP_BACKEND_URL } = process.env;
let authToken = localStorage.getItem("accessToken")
  ? localStorage.getItem("accessToken")
  : null;
console.log("localStorage :>> ", localStorage.getItem("accessToken"));
const axiosInstance = axios.create({
  baseURL: REACT_APP_BACKEND_URL,
  headers: { authorization: "Bearer " + authToken && authToken },
});

axiosInstance.interceptors.request.use(async (request) => {
  authToken = localStorage.getItem("accessToken")
    ? localStorage.getItem("accessToken")
    : null;
  if (!authToken) {
    return request;
  }

  request.headers.authorization = `Bearer ${authToken && authToken}`;
  const user = jwt(authToken);
  const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

  console.log("isExpired :>> ", isExpired);
  if (!isExpired) return request;

  const response = await axios({
    method: "post",
    url: "/api/tokens/refresh",
    headers: { Authorization: "Bearer " + authToken },
  });

  localStorage.setItem("accessToken", response.data.accessToken);
  request.headers.authorization = `Bearer ${response.data.accessToken}`;

  return request;
});

export default axiosInstance;
