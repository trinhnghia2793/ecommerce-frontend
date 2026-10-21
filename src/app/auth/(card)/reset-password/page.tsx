import { Suspense } from "react";
import { ResetPasswordContent } from "./reset-password-content";

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-sm md:max-w-4xl">
      <Suspense
        fallback={
          <div className="bg-card rounded-lg p-6 md:p-8 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
