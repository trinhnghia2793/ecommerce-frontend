"use client";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="bg-card rounded-lg p-6 md:p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground mb-4">
            Reset password token invalid or expired
          </p>
          <Link
            href="/auth/forgot-password"
            className="font-medium text-primary hover:underline"
          >
            Request new forgot password link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm md:max-w-4xl">
      <ResetPasswordForm token={token} />
    </div>
  );
}
