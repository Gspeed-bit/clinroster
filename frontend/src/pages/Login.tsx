import React, { useState } from "react";
import { z } from "zod";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "@/api/authApi";
import { useAuth } from "@/context/AuthContext";
import { LoginFormSchema } from "@/schemas/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertBanner } from "@/components/AlertBanner";

type LocationState = { from?: { pathname: string } } | null;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state as LocationState) || null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    msg: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setIsSubmitting(true);

    try {
      const form = LoginFormSchema.parse({ email, password });
      const data = await authApi.login(form);
      login(data.token, data.role);
      const redirectTo = routeState?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const msg =
        err instanceof z.ZodError
          ? err.issues[0]?.message || "Validation error"
          : err instanceof Error
          ? err.message
          : "Something went wrong";
      setAlert({ type: "error", msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Log in</CardTitle>
        </CardHeader>
        <CardContent>
          {alert && (
            <div className="mb-4">
              <AlertBanner
                type={alert.type}
                title={alert.type === "error" ? "Error" : undefined}
                message={alert.msg}
                onClose={() => setAlert(null)}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Please wait..." : "Log in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
