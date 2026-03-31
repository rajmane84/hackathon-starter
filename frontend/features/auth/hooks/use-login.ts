import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { LoginInput } from "../lib/auth-validator";
import { authService } from "../services/auth.service";
import { sileo } from "sileo";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      queryClient.setQueryData(["auth-user"], data.user);

      sileo.success({ 
        title: "Welcome back!", 
        description: `Logged in as ${data.user.name}` 
      });
      
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      sileo.error({ 
        title: "Login Failed", 
        description: error.message 
      });
    },
  });
};