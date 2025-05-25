import axios from "axios";
import { redirect } from "next/navigation";
import { BE_ENDPOINT } from "./constants";

export const axiosUser = axios.create({
  baseURL: BE_ENDPOINT,
  withCredentials: true,
});

axiosUser.interceptors.request.use((config) => {
  const bearerToken = localStorage.getItem("bearer");
  config.headers["authorization"] = bearerToken;
  return config;
});

axiosUser.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (!error.response || !error.response.status) {
      alert("로그인이 필요합니다");
      redirect("/login");
    }
    if (error.response.status === 401 || error.response.status === 403) {
      const { data: bearerToken } = await axios
        .post(`${BE_ENDPOINT}/auth/refresh`, {}, { withCredentials: true })
        .catch((e) => {
          alert("로그인이 필요합니다!");
          redirect("/login");
        });
      localStorage.setItem("bearer", bearerToken);
      const { config } = error;
      return axios.request({
        ...config,
        headers: { ...config.headers, authorization: bearerToken },
      });
    }
    return Promise.reject(error);
  }
);
