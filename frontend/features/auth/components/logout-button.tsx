"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "../hooks/use-logout";
import { Loader2, LogOut } from "lucide-react";

export const LogoutButton = () => {
  const { mutate, isPending } = useLogout();

  return (
    <Button
      variant="destructive"
      onClick={() => mutate()}
      disabled={isPending}
      className="flex items-center gap-2 cursor-pointer"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      <span>Logout</span>
    </Button>
  );
};
