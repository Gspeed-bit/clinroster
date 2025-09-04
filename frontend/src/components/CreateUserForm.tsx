import React, { useState } from "react";
import { z } from "zod";
import { authApi } from "@/api/authApi";
import { RegisterFormSchema, type UserRole } from "@/schemas/auth";
import { AlertBanner } from "@/components/AlertBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const CreateUserForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("nurse");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    msg: string;
  } | null>(null);

  const reset = () => {
    setEmail("");
    setRole("nurse");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setIsSubmitting(true);

    try {
      const form = RegisterFormSchema.parse({ email, password, role });
      await authApi.register(form); // requires admin token (backend enforces)
      setAlert({ type: "success", msg: "User created successfully" });
      reset();
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
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Create User (Admin only)</CardTitle>
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
              placeholder="nurse@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="New user email"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Temporary Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Temporary password"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="New user role"
            >
              <option value="nurse">nurse</option>
              <option value="supervisor">supervisor</option>
              <option value="admin">admin</option>
            </select>
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating..." : "Create user"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
