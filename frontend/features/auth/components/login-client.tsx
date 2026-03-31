"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail } from "lucide-react";

const LoginClient = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 transition-colors duration-300">
      <Card className="w-full max-w-sm border-border/50 bg-card/50 backdrop-blur-sm shadow-xl dark:shadow-2xl dark:shadow-primary/5">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="grid gap-5">
          {/* Email Field */}
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <div className="relative flex items-center">
              {/* Centered Icon using inset-y-0 */}
              <Mail className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                /* focus-visible:ring-1 makes the ring subtle (not thick) */
                className="pl-10 bg-background/50 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
                required 
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <button className="text-xs text-primary hover:underline underline-offset-4">
                Forgot password?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input 
                id="password" 
                type="password" 
                className="pl-10 bg-background/50 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
                required 
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] bg-primary text-primary-foreground hover:opacity-90">
            Sign In
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button className="text-primary font-medium hover:underline underline-offset-4">
              Sign up
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginClient;