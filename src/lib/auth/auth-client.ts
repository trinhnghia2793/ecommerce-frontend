import { createAuthClient } from "better-auth/client";

// handle url when run on server side
function serverBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(
    /\/+$/, // remove '/' at the end
    "",
  );
}

// create better-auth client
function createConfiguredClient(baseURL: string) {
  return createAuthClient({
    baseURL,
    basePath: "/api/auth",
  });
}

//
type AuthClient = ReturnType<typeof createConfiguredClient>;

let browserClient: AuthClient | null = null;
let browserOrigin: string | null = null;

//
export function getAuthClient(): AuthClient {
  // if run on browser
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;

    // check client exists || origin changed
    if (!browserClient || browserOrigin !== origin) {
      browserClient = createConfiguredClient(origin);
      browserOrigin = origin;
    }

    return browserClient;
  }

  // if run on server
  return createConfiguredClient(serverBaseUrl());
}