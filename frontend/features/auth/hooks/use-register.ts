import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import { authService } from "../services/auth.service";
import type { RegisterInput, VerifyOtpInput } from "../lib/auth-validator";
import type { AuthResponseData } from "../types";

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: (data) => {
      toast.success("OTP Sent", {
        description: `A 6-digit code has been sent to ${data.email}. Please check your inbox.`,
      });
      // Navigate to OTP page carrying the email as a query param
      router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
    },
    onError: (error: Error) => {
      console.error("Registration failed: ", error);
      toast.error("Registration Failed");
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
      toast.success("Email Verified", {
        description: "Your account has been created successfully. Welcome!",
      });
      onSuccess?.(data);
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      console.error("Verification failed: ", error);
      toast.error("Verification Failed");
    },
  });
};
