"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useAuthSession } from "./use-auth";
import { useEffect, useRef } from "react";
import { getAuthClient } from "@/lib/auth/auth-client";

const COOLDOWN_MS = 60_000;
const STORAGE_KEY = "anonymous-singin-cooldown-until";

// check better auth ratelimit cooldown time
function isInCoolDown(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  const until = Number(sessionStorage.getItem(STORAGE_KEY) ?? "0");
  return until > Date.now();
}

// set better auth ratelimit cooldown
function setCooldown(ms = COOLDOWN_MS): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, String(Date.now() + ms));
}

// receive rate limit error
function isRateLimitedError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;

  const status =
    (err as { status?: number }).status ??
    (err as { response?: { status?: number } }).response?.status;

  return status === 429;
}

// hook: read current session, call anonymous sign in if needed, set cooldown when hit ratelimit
export function useEnsureAnonymousSession() {
  const { data: session, isLoading } = useAuthSession();
  const queryClient = useQueryClient();
  const signingInRef = useRef(false); // set to true when have a sign in request

  useEffect(() => {
    if (isLoading || signingInRef.current) return;
    if (session?.isAuthenticated) return; // check if user signed in
    if (isInCoolDown()) return; // check limit cooldown

    signingInRef.current = true;

    void getAuthClient()
      .signIn.anonymous()
      .then(() => {
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.removeItem(STORAGE_KEY);
        }

        void queryClient.invalidateQueries({
          queryKey: ["auth", "session"],
        });
      })
      .catch((err: unknown) => {
        if (isRateLimitedError(err)) {
          setCooldown();
        }
        console.error("[auth] Anonymous sign in failed: ", err);
      })
      .finally(() => {
        signingInRef.current = false;
      });
  }, [isLoading, session?.isAuthenticated, queryClient]);
}
