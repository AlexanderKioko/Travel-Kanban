"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleNavigateToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full opacity-15 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-20 animate-pulse" style={{animationDelay: '0.5s'}}></div>
        {/* Additional floating elements */}
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-10 animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-15 animate-pulse" style={{animationDelay: '1.5s'}}></div>
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}
        ></div>
      </div>
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-50">
        <Button
          variant="ghost"
          onClick={handleBackToHome}
          className="text-slate-600 hover:text-slate-800 hover:bg-white/80 backdrop-blur-sm transition-all duration-200 border border-white/40 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
      {/* Main Content */}
      <div className="relative z-30 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-xl transform rotate-3 hover:rotate-1 transition-transform duration-300">
              <Plane className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Join TripBoard</h1>
            <p className="text-slate-600 text-lg">Start planning your perfect trips today</p>
          </div>
          {/* Register Card */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border border-white/60 overflow-hidden relative">
            {/* Card background gradient - moved to lower z-index */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 z-0"></div>

            <CardHeader className="relative z-20 pb-6">
              <CardTitle className="text-center text-2xl font-semibold text-slate-800">
                Create Account
              </CardTitle>
              <p className="text-center text-slate-600 mt-2">
                Get started with your free account
              </p>
            </CardHeader>

            <CardContent className="relative z-20 space-y-6">
              <RegisterForm />

              {/* Divider */}
              <div className="relative my-8 z-20">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm uppercase">
                  <span className="bg-white px-4 text-slate-500 font-medium">Or sign up with</span>
                </div>
              </div>
              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4 relative z-20">
                <Button
                  variant="outline"
                  className="w-full border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 py-3 bg-white text-slate-700"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC04"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 py-3 bg-white text-slate-700"
                >
                  <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </Button>
              </div>
              {/* Sign In Link */}
              <div className="text-center pt-6 border-t border-slate-100 relative z-20">
                <p className="text-sm text-slate-600">
                  Already have an account?{" "}
                  <button
                    onClick={handleNavigateToLogin}
                    className="text-blue-600 hover:text-blue-500 font-semibold transition-colors hover:underline bg-transparent border-none cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
          {/* Trust Indicators */}
          <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-slate-500 relative z-20">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Free Forever</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span>10k+ Users</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span>Secure</span>
            </div>
          </div>
          {/* Footer */}
          <div className="text-center mt-8 text-xs text-slate-500 space-y-2 relative z-20">
            <p>
              By creating an account, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500 transition-colors hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500 transition-colors hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
