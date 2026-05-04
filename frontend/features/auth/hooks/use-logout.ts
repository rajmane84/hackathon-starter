import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
      toast.success("Logged out successfully");
      router.push("/auth/login");
    },
    onError: (error: any) => {
      // Even if backend fails (e.g. token expired), we should still clear local state
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
      router.push("/auth/login");
      toast.error(error.message || "Failed to log out");
    },
  });
};
