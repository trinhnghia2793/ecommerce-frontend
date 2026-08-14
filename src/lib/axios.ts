import axios, { AxiosError } from "axios";
import { redirect } from "next/navigation";
import { toast } from "sonner";

// axiosInstance config
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30 * 1000,
  withCredentials: true, // include cookies in each request
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
    if (error.response?.status === 401) {
      toast.error("You must login to continue.");

      if (typeof window !== "undefined") {
        redirect("/auth/signin");
      }
    }

    if (error.response?.status === 403) {
      toast.error("You don't have permission to do this.");
    }

    if (!error.response) {
      toast.error("Could not connect to server. Please try again later.");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
