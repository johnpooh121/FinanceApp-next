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
      alert("로그인이 되어있지 않습니다!");
      redirect("/login");
    }
    if (error.response.status === 401) {
      const { data } = await axios
        .post(`${BE_ENDPOINT}/auth/refresh`)
        .catch((e) => {
          alert("로그인이 되어있지 않습니다!");
          redirect("/login");
        });
      const { bearerToken } = data;
      localStorage.setItem("bearer", bearerToken);
      const { config } = error;
      return axios.request(config);
    }
    return Promise.reject(error);
  }
);
