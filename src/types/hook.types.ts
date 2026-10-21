import { User } from "./api.types";

export type AuthMeResponse = {
  success: boolean;
  authenticated: boolean;
  user: User | null;
};

export type AuthSession = {
  user: User | null;
  isGuest: boolean;
  isAuthenticated: boolean;
}