import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8 space-y-6">
        <h1 className="text-3xl font-semibold text-center">Login</h1>
        <LoginForm />
      </Card>
    </div>
  );
}