import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { sileo } from "sileo";
import { authService } from "../services/auth.service";
import type { RegisterInput, VerifyOtpInput } from "../lib/auth-validator";
import type { AuthResponseData } from "../types";

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: (data) => {
      sileo.success({
        title: "OTP Sent",
        description: `A 6-digit code has been sent to ${data.email}. Please check your inbox.`,
      });
      // Navigate to OTP page carrying the email as a query param
      router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
    },
    onError: (error: Error) => {
      sileo.error({
        title: "Registration Failed",
        description: error.message,
      });
    },
  });
};

export const useVerifyOtp = ({
  onSuccess,
}: {
  onSuccess?: (data: AuthResponseData) => void;
} = {}) => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: VerifyOtpInput) => authService.verifyOtp(data),
    onSuccess: (data) => {
      sileo.success({
        title: "Email Verified",
        description: "Your account has been created successfully. Welcome!",
        styles: {
          title: "text-black! text-sans! font-semibold!",
          description: "text-neutral-800! text-sans!",
        },
      });
      onSuccess?.(data);
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      sileo.error({
        title: "Verification Failed",
        description: error.message,
        styles: {
          title: "text-black! text-sans! font-semibold!",
          description: "text-neutral-800! text-sans!",
        },
      });
    },
  });
};
