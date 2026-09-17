import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";
import { v7 as uuidv7 } from "uuid";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "./send-auth-email";

// get app url
function getAppUrl(): string {
  const raw =
    process.env.BETTER_AUTH_APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  return raw.replace(/\/+$/, "");
}

const appUrl = getAppUrl();

// create a connection pool
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5433", 10),
  user: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "ecommerce-mtc",
  max: 20,
  idleTimeoutMillis: 30000, // 30s
  connectionTimeoutMillis: 2000,
});

// betterAuth config
export const auth = betterAuth({
  database: pool,

  plugins: [bearer(), nextCookies()], // nextCookies() auto set cookies when sign in / sign up

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, token }) => {
      const resetPasswordUrl = `${appUrl}/auth/reset-password?token=${encodeURIComponent(token)}`;
      await sendPasswordResetEmail(user.email, user.name, resetPasswordUrl);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
    expiresIn: 24 * 60 * 60, // verify token expire time
    sendVerificationEmail: async ({ user, token }) => {
      const verifyUrl = `${appUrl}/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(user.email)}`;
      await sendVerificationEmail(user.email, user.name, verifyUrl);
    },
  },

  secret: process.env.BETTER_AUTH_SECRET || "",

  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  basePath: "/api/auth",

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 1 week
    updateAge: 60 * 60 * 24, // 1 day
    fields: {
      userId: "user_id",
      expiresAt: "expires_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

  user: {
    fields: {
      emailVerified: "email_verified",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

  account: {
    fields: {
      userId: "user_id",
      accountId: "account_id",
      providerId: "provider_id",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      idToken: "id_token",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

  verification: {
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

  advanced: {
    database: {
      generateId: () => uuidv7(),
    },
  },
});
