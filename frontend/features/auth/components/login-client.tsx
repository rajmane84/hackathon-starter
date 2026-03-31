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
import Link from "next/link";
import { sileo } from "sileo";

const LoginClient = () => {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 transition-colors duration-300">
      <Card className="border-border/50 bg-card/50 dark:shadow-primary/5 w-full max-w-sm shadow-xl backdrop-blur-sm dark:shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-foreground text-3xl font-extrabold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-5">
          {/* Email Field */}
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative flex items-center">
              {/* Centered Icon using inset-y-0 */}
              <Mail className="text-muted-foreground pointer-events-none absolute left-3 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                /* focus-visible:ring-1 makes the ring subtle (not thick) */
                className="bg-background/50 focus-visible:ring-ring pl-10 focus-visible:ring-1 focus-visible:ring-offset-0"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Link
                href={"/auth/forgot-password"}
                className="text-primary text-xs underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Lock className="text-muted-foreground pointer-events-none absolute left-3 h-4 w-4" />
              <Input
                id="password"
                type="password"
                className="bg-background/50 focus-visible:ring-ring pl-10 focus-visible:ring-1 focus-visible:ring-offset-0"
                required
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            onClick={() => {
              sileo.success({
                title: "OTP Sent Successfully",
                description:
                  "Please check your email for the verification code.",
                styles: {
                  title: "text-black! text-sans! font-semibold!",
                  description: "text-neutral-800! text-sans!",
                },
              });
            }}
            className="bg-primary text-primary-foreground w-full font-semibold transition-all hover:scale-[1.01] hover:opacity-90 active:scale-[0.99]"
          >
            Sign In
          </Button>
          <p className="text-muted-foreground text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-primary font-medium underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginClient;
