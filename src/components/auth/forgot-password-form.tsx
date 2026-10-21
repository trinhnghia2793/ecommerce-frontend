"use client";

import { useForgotPassword } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { ForgotPasswordDto } from "@/types/api.types";
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

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const forgotPasswordMutation = useForgotPassword({
    success:
      "Reset password email has been sent. Please check your email inbox",
    error: "Send reset password email failed",
  });

  const forgotPasswordSchema = useMemo(
    () =>
      z.object({
        email: z.email("Invalid email"),
      }),
    [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordDto>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordDto) => {
    await forgotPasswordMutation.mutateAsync(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Forgot password</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your email to receive reset password email
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  disabled={forgotPasswordMutation.isPending}
                />
                {errors.email && (
                  <FieldError>{errors.email.message}</FieldError>
                )}
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={forgotPasswordMutation.isPending}
                >
                  {forgotPasswordMutation.isPending ? 'Sending email...' : 'Send reset password email'}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Remember password?{' '}
                <a href="/auth/signin" className="font-medium text-primary hover:underline">Sign in</a>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
