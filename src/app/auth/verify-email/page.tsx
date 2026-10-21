import { Suspense } from "react";
import { VerifyEmailContent } from "./verify-email-content";

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-sm md:max-w-4xl">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
