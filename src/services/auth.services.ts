import { getAuthClient } from "@/lib/auth/auth-client";
import {
  AuthResponse,
  ForgotPasswordDto,
  ForgotPasswordResponse,
  ResetPasswordDto,
  ResetPasswordResponse,
  SignInDto,
  SignUpDto,
  User,
} from "@/types/api.types";

// convert Better Auth's user type to app's user type
function mapAuthUser(u: {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}): User {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    image: u.image ?? undefined,
    emailVerified: u.emailVerified,
    createdAt:
      u.createdAt instanceof Date
        ? u.createdAt.toISOString()
        : String(u.createdAt),
    updatedAt:
      u.updatedAt instanceof Date
        ? u.updatedAt.toISOString()
        : String(u.updatedAt),
  };
}

// read session token
async function readSessionToken(): Promise<string> {
  const s = await getAuthClient().getSession();
  return s.data?.session?.token ?? "";
}

// auth service
export const authService = {
  // sign up
  signUp: async (data: SignUpDto): Promise<AuthResponse> => {
    // call BetterAuth through getAuthClient to do SignUp
    const res = await getAuthClient().signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    if (res.error) {
      throw Object.assign(new Error(res.error.message || "Sign up failed"), {
        response: {
          data: {
            message: res.error.message,
          },
        },
      });
    }

    const raw = res.data?.user;
    if (!raw) {
      throw Object.assign(new Error("Sign up failed"), {
        response: {
          data: {
            message: "Cannot get user info",
          },
        },
      });
    }

    const user = mapAuthUser(raw);
    const token = await readSessionToken();

    return {
      success: true,
      user,
      token,
    };
  },

  // resend verification email
  resendVerificationEmail: async (email: string): Promise<void> => {
    const res = await getAuthClient().sendVerificationEmail({ email });

    if (res.error) {
      const msg = res.error.message || "Send verification email failed";
      throw Object.assign(new Error(msg), {
        response: {
          data: {
            message: msg,
          },
        },
      });
    }
  },

  // sign in
  signIn: async (
    data: SignInDto & { rememberMe?: boolean },
  ): Promise<AuthResponse> => {
    const res = await getAuthClient().signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    });

    if (res.error) {
      throw Object.assign(new Error(res.error.message || "Login failed"), {
        response: {
          data: {
            message: res.error.message,
          },
        },
      });
    }

    // check if email verified
    const rawUserInfo = res.data?.user;
    if (!rawUserInfo) {
      throw Object.assign(new Error("Login failed"), {
        response: {
          data: {
            message: "Cannot get user info",
          },
        },
      });
    }

    const user = mapAuthUser(rawUserInfo);
    if (user.emailVerified === false) {
      throw Object.assign(
        new Error(
          "Please verify your email before login. Check your email inbox",
        ),
        {
          response: {
            data: {
              message:
                "Please verify your email before login. Check your email inbox",
            },
          },
        },
      );
    }

    const token = await readSessionToken();
    return {
      success: true,
      user,
      token,
    };
  },

  // forgot password
  forgotPassword: async (
    data: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponse> => {
    const res = await getAuthClient().requestPasswordReset({
      email: data.email,
      redirectTo: `/auth/reset-password`,
    });

    if (res.error) {
      const msg = res.error.message || "Send email failed";
      throw Object.assign(new Error(msg), {
        response: {
          data: {
            message: msg,
          },
        },
      });
    }

    return {
      success: true,
      message: "Reset password email sent",
    };
  },

  // reset password
  resetPassword: async (
    data: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> => {
    const res = await getAuthClient().resetPassword({
      token: data.token,
      newPassword: data.newPassword,
    });

    if (res.error) {
      throw Object.assign(
        new Error(res.error.message || "Reset password failed"),
        {
          response: {
            data: {
              message: res.error.message,
            },
          },
        },
      );
    }

    return {
      success: true,
    };
  },

  // sign in with Google
  signInWithGoogle: async (redirectPath?: string): Promise<void> => {
    if (typeof window === "undefined") return;

    const redirect =
      redirectPath !== undefined && redirectPath !== ""
        ? redirectPath
        : "/product/catalog";

    const encoded = encodeURIComponent(
      redirect.startsWith("/") ? redirect : `/${redirect}`,
    );
    const callbackURL = `/auth/callback/google?redirect=${encoded}`;

    const res = await getAuthClient().signIn.social({
      provider: "google",
      callbackURL,
    });

    if (res.error) {
      throw new Error(res.error.message || "Login with Google failed");
    }
    if (res.data?.url) {
      window.location.href = res.data.url;
    }
  },

  // sign out
  signOut: async (): Promise<void> => {
    await getAuthClient().signOut();
  }
};
