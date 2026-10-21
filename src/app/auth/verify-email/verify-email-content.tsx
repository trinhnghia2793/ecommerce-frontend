"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { useResendVerificationEmail } from "@/hooks/use-auth";
import { getAuthClient } from "@/lib/auth/auth-client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    token && email ? "idle" : "err",
  );
  const [message, setMessage] = useState(
    token && email ? "" : "missing token / email",
  );

  const { mutate: resend, isPending: isResending } = useResendVerificationEmail(
    {
      success: "Verification email sent. Please check your email inbox",
      error: "Send verification email failed",
    },
  );

  useEffect(() => {
    if (!token) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("loading");

    // call better-auth client to send email
    void getAuthClient()
      .verifyEmail({ query: { token } })
      .then(({ error }) => {
        if (error) {
          console.error("[auth] verifyEmail failed", error);
          setStatus("err");
          setMessage("Verify email failed");
          return;
        }

        setStatus("ok");
        setMessage("Verify email successfully");
      })
      .catch((err) => {
        console.error("[auth] verifyEmail request error", err);
        setStatus("err");
        setMessage("Couldn't connect to server. Please try again");
      });
  }, [token]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Verify email</h1>

      {status === "loading" && (
        <p className="text-muted-foreground">Verifying...</p>
      )}
      {(status === "ok" || status === "err") && (
        <p className={status === "ok" ? "text-green-600" : "text-destructive"}>
          {message}
        </p>
      )}

      {status === 'err' && email && (
        <Button disabled={isResending} onClick={() => resend(email)}>
          {isResending ? 'Sending...' : 'Resend verification email'}
        </Button>
      )}

      <Link href='/auth/signin' className={buttonVariants({variant: 'outline'})}>Return to sign in</Link>
    </div>
  );
}
