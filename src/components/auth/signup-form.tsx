"use client";
import { useGoogleSignIn, useSignUp } from "@/hooks/use-auth";
import { SignUpDto } from "@/types/api.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo } from "react";
import * as z from "zod";
import { cn } from "@/lib/utils";
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
import { Button } from "@/components/ui/button";
import { SocialAuthButtons } from "./social-auth-buttons";

type SignUpFormValues = SignUpDto & { confirmPassword: string };

const SignUpForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const signUpMutation = useSignUp({
    success: "Account created successfully!",
    verifyEmail:
      "Account created successfully! Please check your email to verify",
    error: "Register failed",
  });

  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleSignIn({
    error: "Cannot initialize Google login",
  });

  const signUpSchema = useMemo(
    () =>
      z
        .object({
          name: z.string().min(2, "Name must be at least 2 characters"),
          email: z.email("Invalid email"),
          password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must have at least one uppercase letter")
            .regex(/[0-9]/, "Password must have at least one digit"),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "password does not match",
          path: ["confirmPassword"],
        }),
    [], // dependency list
  );

  // validation
  const {
    register, // register each input into form
    handleSubmit, // wrap handle method when submit form
    formState: { errors }, // get error from formState
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    const { email, password, name } = data;
    // get result from useSignUp hook (return useMutation) --> call mutateAsync
    await signUpMutation.mutateAsync({ email, password, name });
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create new account</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your information
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="name">Full name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g: John Doe"
                  {...register("name")}
                  disabled={signUpMutation.isPending}
                />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g: johndoe@example.com"
                  {...register("email")}
                  disabled={signUpMutation.isPending}
                />
                {errors.email && (
                  <FieldError>{errors.email.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  disabled={signUpMutation.isPending}
                />
                {errors.password && (
                  <FieldError>{errors.password.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  disabled={signUpMutation.isPending}
                />
                {errors.confirmPassword && (
                  <FieldError>{errors.confirmPassword.message}</FieldError>
                )}
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={signUpMutation.isPending}
                >
                  {signUpMutation.isPending
                    ? "Creating account..."
                    : "Register"}
                </Button>
              </Field>

              <FieldSeparator>or</FieldSeparator>
              <SocialAuthButtons
                onGoogleSignIn={signInWithGoogle}
                isGoogleLoading={isGoogleLoading}
              />

              <FieldDescription className="text-center">
                Already have an account?{" "}
                <a
                  href="/auth/signin"
                  className="font-medium text-primary no-underline hover:underline"
                >
                  Login
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpForm;
