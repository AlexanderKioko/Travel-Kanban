import React from "react";
import { Card } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8 space-y-6">
        <h1 className="text-3xl font-semibold text-center">Create an account</h1>
        <RegisterForm />
      </Card>
    </div>
  );
}