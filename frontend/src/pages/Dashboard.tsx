import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, LogOut } from "lucide-react";

export const Dashboard: React.FC = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  const handleCreateUser = () => {
    navigate("/admin/users");
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="p-6">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>ClinRoster Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Signed in as <b>{state.role ?? "unknown"}</b>.
          </p>

          {/* Admin-only actions */}
          {state.role === "admin" && (
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleCreateUser}
                aria-label="Create a new user"
                className="inline-flex items-center"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Create user
              </Button>
            </div>
          )}

          <div className="pt-2">
            <Button
              variant="outline"
              onClick={handleLogout}
              aria-label="Log out"
              className="inline-flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
