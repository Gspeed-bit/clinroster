import React from "react";
import { CreateUserForm } from "@/components/CreateUserForm";

export const UsersPage: React.FC = () => {
  return (
    <div className="p-6">
      <CreateUserForm />
    </div>
  );
};
