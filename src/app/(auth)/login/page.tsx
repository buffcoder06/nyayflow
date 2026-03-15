"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Scale, Loader2 } from "lucide-react";

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
import { useAuthStore } from "@/lib/store/auth-store";

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().min(1, "Email or phone is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// DEMO CREDENTIALS
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_CREDENTIALS = [
  {
    label: "Login as Advocate",
    email: "priya.sharma@nyayvakil.in",
    password: "demo123",
    description: "Adv. Priya Sharma",
  },
  {
    label: "Login as Junior",
    email: "rahul.mehta@nyayvakil.in",
    password: "demo123",
    description: "Adv. Rahul Mehta",
  },
  {
    label: "Login as Clerk",
    email: "suresh.patil@nyayvakil.in",
    password: "demo123",
    description: "Suresh Patil",
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!", {
        description: "You have been signed in successfully.",
      });
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Invalid credentials. Please try again.";
      toast.error("Login failed", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (email: string, password: string) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", password, { shouldValidate: true });
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Card className="w-full shadow-lg border-0 bg-white">
      <CardHeader className="text-center pb-2">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-4">
          <div className="w-9 h-9 bg-[#1e3a5f] rounded-lg flex items-center justify-center shadow-sm">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[#1e3a5f] tracking-tight">
            NyayVakil
          </span>
        </div>

        <CardTitle className="text-2xl font-bold text-slate-900">
          Welcome back
        </CardTitle>
        <CardDescription className="text-slate-500 mt-1">
          Sign in to your legal practice account
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* Email / Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-slate-700 font-medium">
              Email or Phone
            </Label>
            <Input
              id="email"
              type="text"
              placeholder="advocate@chamber.in or 9820XXXXXX"
              autoComplete="email"
              aria-invalid={!!errors.email}
              className="h-10 text-sm"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-700 font-medium">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#1e3a5f] hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                className="h-10 text-sm pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* OR Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
              Demo Access
            </span>
          </div>
        </div>

        {/* Demo credential buttons */}
        <div className="space-y-2">
          <p className="text-xs text-slate-500 text-center mb-3">
            Explore NyayVakil with pre-filled demo credentials
          </p>
          {DEMO_CREDENTIALS.map((cred) => (
            <button
              key={cred.email}
              type="button"
              onClick={() => fillDemoCredentials(cred.email, cred.password)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-slate-200 hover:border-[#1e3a5f]/40 hover:bg-slate-50 transition-all text-sm group"
            >
              <div className="text-left">
                <span className="font-medium text-slate-800 group-hover:text-[#1e3a5f] transition-colors">
                  {cred.label}
                </span>
                <p className="text-xs text-slate-400 mt-0.5">{cred.description}</p>
              </div>
              <span className="text-xs text-slate-300 group-hover:text-[#1e3a5f]/60 font-mono transition-colors">
                Fill →
              </span>
            </button>
          ))}
        </div>
      </CardContent>

      <CardFooter className="justify-center border-t border-slate-100 py-4">
        <p className="text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-[#1e3a5f] font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
