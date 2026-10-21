"use client";

import { useResetPassword } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ResetPasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
};

interface ResetPasswordFormProps extends React.ComponentProps<"div"> {
  token: string;
}

export function ResetPasswordForm({
  className,
  token,
  ...props
}: ResetPasswordFormProps) {
  const resetPasswordMutation = useResetPassword({
    success: "Reset password sucessully!",
    error: "Reset password failed",
  });

  const resetPasswordSchema = useMemo(
    () =>
      z
        .object({
          newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must have at least one uppercase letter")
            .regex(/[0-9]/, "Password must have at least one digit"),
          confirmPassword: z.string(),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: "password does not match",
          path: ["confirmPassword"],
        }),
    [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    await resetPasswordMutation.mutateAsync({
      token,
      newPassword: data.newPassword,
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Reset password</h1>
                <p className="text-muted-foreground text-balance">
                  Enter new password for your account
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="newPassword">New password</FieldLabel>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  {...register("newPassword")}
                  disabled={resetPasswordMutation.isPending}
                />
                {errors.newPassword && (
                  <FieldError>{errors.newPassword.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter new password"
                  {...register("confirmPassword")}
                  disabled={resetPasswordMutation.isPending}
                />
                {errors.confirmPassword && (
                  <FieldError>{errors.confirmPassword.message}</FieldError>
                )}
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={resetPasswordMutation.isPending}
                >
                  {resetPasswordMutation.isPending
                    ? "Chotto matte..."
                    : "Reset password"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                <a
                  href="/auth/signin"
                  className="font-medium text-primary no-underline hover:underline"
                >
                  Return to Sign in
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
