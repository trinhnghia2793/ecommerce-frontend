"use client";

import { useGoogleSignIn, useSignIn } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { SignInDto } from "@/types/api.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SocialAuthButtons } from "./social-auth-buttons";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? undefined;

  const signInMutation = useSignIn(
    {
      success: "Login successfully",
      error: "Login failed",
    },
    redirectTo,
  );

  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleSignIn({
    error: "Cannot initialize Google login",
  });

  type SignInFormValues = SignInDto & { rememberMe: boolean };

  const signInSchema = useMemo(
    () =>
      z.object({
        email: z.email("Invalid email"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        rememberMe: z.boolean(),
      }),
    [],
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    await signInMutation.mutateAsync(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back!</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your information to sign in
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder=""
                  {...register("email")}
                  disabled={signInMutation.isPending}
                />
                {errors.email && (
                  <FieldError className="text-destructive">
                    {errors.email.message}
                  </FieldError>
                )}
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="/auth/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot password
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  disabled={signInMutation.isPending}
                />
                {errors.password && (
                  <FieldError className="text-destructive">
                    {errors.password.message}
                  </FieldError>
                )}
              </Field>

              <Field>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={watch("rememberMe")}
                    onCheckedChange={(v) => setValue("rememberMe", v === true)}
                    disabled={signInMutation.isPending}
                  />
                  Remember me
                </label>
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={signInMutation.isPending}
                >
                  {signInMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </Field>

              <FieldSeparator>or</FieldSeparator>
              <SocialAuthButtons
                onGoogleSignIn={signInWithGoogle}
                isGoogleLoading={isGoogleLoading}
              />

              <FieldDescription className="text-center">
                Don&lsquo;t have an account?{" "}
                <a
                  href="/auth/signup"
                  className="font-medium text-primary hover:underline"
                >
                  Sign up
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block">
            <Image
              src="/login-thumbnail.gif"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              fill
              priority
              sizes="(max-width: 768px) 0px, 50vw"
              unoptimized
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignInForm;
