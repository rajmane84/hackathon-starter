import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LoginInput } from "../lib/auth-validator";
import { authService } from "../services/auth.service";
import { toast } from "sonner"

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      queryClient.setQueryData(["auth-user"], data.user);

      toast.success("Welcome back!", { 
        description: `Logged in as ${data.user.email}` 
      });
      
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      console.error("Login failed: ", error);
      toast.error("Login Failed");
    },
  });
};