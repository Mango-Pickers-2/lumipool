import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  User,
  Package,
  Wrench,
} from "lucide-react";

import {
  useNavigate,
  Link,
  Navigate,
} from "react-router-dom";

import { Logo } from "@/components/Logo";

import { supabase } from "@/lib/supabase";

import {
  useLumiStore,
  type Role,
} from "@/store/lumipool";

export default function Login() {
  const navigate = useNavigate();

  const user = useLumiStore((s) => s.currentUser);
  const setUser = useLumiStore((s) => s.setUser);

  const [showPassword, setShowPassword] =
    useState(false);

  const [role, setRole] =
    useState<Role>("buyer");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    document.title = "Login — LumiPool";

    const meta = document.querySelector(
      'meta[name="description"]'
    );

    if (meta) {
      meta.setAttribute(
        "content",
        "Login to your LumiPool account."
      );
    }
  }, []);

  // already authenticated
  if (user) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  const roles = [
    {
      id: "buyer" as Role,
      label: "Buyer",
      icon: User,
    },

    {
      id: "supplier" as Role,
      label: "Supplier",
      icon: Package,
    },

    {
      id: "installer" as Role,
      label: "Installer",
      icon: Wrench,
    },
  ];

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const sanitizedPhone =
        phone.replace(/\s+/g, "");

      const email =
        `${sanitizedPhone}@lumipool.app`;

      const {
        data,
        error: authError,
      } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        setError(
          "Invalid phone number or password."
        );

        setLoading(false);

        return;
      }

      const metadata =
        data.user.user_metadata;

      // IMPORTANT
      // restore role from metadata
      // not from selected UI role

      const resolvedRole =
        metadata?.role || role;

      setUser({
        name:
          metadata?.name ||
          sanitizedPhone,

        role: resolvedRole,

        balance:
          resolvedRole === "buyer"
            ? 100000
            : resolvedRole === "supplier"
            ? 4800000
            : 320000,
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome to LumiPool
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Access your energy operations dashboard
          </p>
        </div>

        {/* Role Selector */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {roles.map((item) => {
            const Icon = item.icon;

            const active =
              role === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setRole(item.id)
                }
                className={`rounded-2xl border p-4 transition-all ${
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-lg"
                    : "border-border bg-card hover:bg-muted"
                }`}
              >
                <Icon className="mx-auto h-5 w-5" />

                <div className="mt-2 text-sm font-semibold">
                  {item.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >
          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Phone Number
            </label>

            <input
              type="text"
              required
              placeholder="+234 80 1234 5678"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-foreground outline-none transition focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Password
            </label>

            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="h-12 w-full rounded-xl border border-input bg-background px-4 pr-12 text-foreground outline-none transition focus:ring-2 focus:ring-ring"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-3"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {loading
              ? "Signing in..."
              : "Login"}
          </button>

          {/* Signup */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}