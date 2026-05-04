import { LogoutButton } from "@/features/auth/components/logout-button";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 items-center justify-center h-full min-h-screen w-full bg-background text-foreground dark:bg-background dark:text-foreground">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Home page</h1>
        <p className="text-muted-foreground text-lg">You are successfully logged in!</p>
      </div>
      
      <LogoutButton />
    </div>
  );
}
