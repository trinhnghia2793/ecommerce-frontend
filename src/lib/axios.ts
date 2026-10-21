import axios, { AxiosError } from "axios";
import { toast } from "sonner";

// axiosInstance config
const axiosInstance = axios.create({
  baseURL: "/api/nest",
  timeout: 30 * 1000,
  // withCredentials: true, // include cookies in each request (now we have proxy, so we don't need it anymore)
  headers: {
    "Content-Type": "application/json",
  },
});

// interceptor: place where every request/response have to pass before go to code
axiosInstance.interceptors.response.use(
  // when success
  (response) => response,

  // when error
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      const redirect = encodeURIComponent(path + window.location.search);

      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = `/auth/signin?redirect=${redirect}`;
    }

    if (error.response?.status === 403 && typeof window !== "undefined") {
      toast.error("You don't have permission to do this.");
    }

    if (!error.response && typeof window !== "undefined") {
      toast.error("Could not connect to server. Please try again later.");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
