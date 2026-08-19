import axios from "axios";

import { gitHubApiUrl } from "../constants/github";

const axiosInstance = axios.create({
  baseURL: gitHubApiUrl,
});

axiosInstance.interceptors.request.use((config) => {
  // attach token to request header
  return config;
});

axiosInstance.interceptors.response.use((response) => {
  return response;
});

export default axiosInstance;
