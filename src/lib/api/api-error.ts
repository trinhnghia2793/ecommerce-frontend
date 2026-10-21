import { isAxiosError, isCancel } from "axios";
import { toast } from "sonner";

type ApiErrorBody = {
  message?: string | string[];
};

// get API error message
export function getApiErrorMessage(error: unknown, fallback: string): string {
  // axios error
  if (isAxiosError<ApiErrorBody>(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message) && message.length > 0) return message[0];
    if (typeof message === "string" && message) return message;
    return fallback;
  }

  // normal error
  if (error instanceof Error && error.message) return error.message;

  // fallback
  return fallback;
}

// check if error is handled by axios --> no need to show toast
function isHandledGlobally(error: unknown): boolean {
  if (isCancel(error)) return true;
  if (!isAxiosError(error)) return false;
  return !error.response || error.response.status === 403;
}

// show error message (toast) - used by hooks
export function toastApiError(error: unknown, fallback: string): void {
  if (isHandledGlobally(error)) return;
  toast.error(getApiErrorMessage(error, fallback));
}

// onError methods in mutation
export function mutationErrorToast(fallback: string) {
  // return method (with error received from callback)
  return (error: unknown) => toastApiError(error, fallback)
}