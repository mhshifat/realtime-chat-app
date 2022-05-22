import axios from "axios";
import { LOCAL_STORAGE_NAMES } from "../constants";

const { NEXT_PUBLIC_API_URI } = process.env;
export const http = axios.create({
  baseURL: `${NEXT_PUBLIC_API_URI}/api/v1`
})

http.interceptors.request.use(function (config) {
  const token = localStorage.getItem(LOCAL_STORAGE_NAMES.AUTH_TOKEN);
  return {
    ...config,
    headers: {
      Authorization: token ? `Bearer ${token}` : ""
    }
  };
}, function (error) {
  return Promise.reject(error);
});