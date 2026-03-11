"use client";

import { useState, useTransition } from "react";
import { signIn, signUp } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      if (tab === "signin") {
        const result = await signIn(formData);
        if (result?.error) setMessage({ type: "error", text: result.error });
      } else {
        const result = await signUp(formData);
        if (result?.error) setMessage({ type: "error", text: result.error });
        if (result?.success) setMessage({ type: "success", text: result.success });
      }
    });
  };
  const handleTabSwitch = (newTab: "signin" | "signup") => {
    setTab(newTab);
    setMessage(null);
    const form = document.getElementById("auth-form") as HTMLFormElement | null;
    form?.reset();
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">

        <div className="flex flex-col items-center gap-3 text-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">GridApp</h1>
            <p className="text-sm text-muted-foreground mt-0.5">AG-Grid View Management System</p>
          </div>
        </div>

        <Card className="shadow-lg border">
          <CardHeader className="pb-4">
            <div className="flex rounded-lg border bg-muted p-1 gap-1">
              <button
                onClick={() => handleTabSwitch("signin")}
                className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${tab === "signin"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Sign In
              </button>
              <button
                onClick={() => handleTabSwitch("signup")}
                className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${tab === "signup"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Sign Up
              </button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {message && (
              <Alert variant={message.type === "error" ? "destructive" : "default"} className={message.type === "success" ? "border-green-200 bg-green-50 text-green-800" : ""}>
                {message.type === "error"
                  ? <AlertCircle className="h-4 w-4" />
                  : <CheckCircle2 className="h-4 w-4 text-green-600" />}
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" id="auth-form">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete={tab === "signup" ? "new-password" : "current-password"}
                  placeholder="••••••••"
                  minLength={6}
                />
                {tab === "signup" && (
                  <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                )}
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-0">
            <Button
              type="submit"
              form="auth-form"
              disabled={isPending}
              className="w-full"
              size="lg"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending
                ? tab === "signin" ? "Signing in..." : "Creating account..."
                : tab === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
