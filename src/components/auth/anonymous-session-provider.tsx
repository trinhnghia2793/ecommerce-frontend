"use client";

import { useEnsureAnonymousSession } from "@/hooks/use-ensure-anonymous-session";

// this provider is used only in product area layout, not root layout
export function AnonymousSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEnsureAnonymousSession();

  return <>{children}</>;
}
