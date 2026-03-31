import ToggleTheme from "@/components/toggle-theme";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex h-full min-h-screen w-full bg-background text-foreground dark:bg-background dark:text-foreground">
      <ToggleTheme />
    </div>
  );
}
