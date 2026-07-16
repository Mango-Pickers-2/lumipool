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

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

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

  const [email, setEmail] =
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
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const profileSnapshot = await getDoc(doc(db, "users", credential.user.uid));
      let metadata = profileSnapshot.data();

      if (!profileSnapshot.exists()) {
        const recoveredProfile = {
          name: email.split("@")[0],
          email: credential.user.email ?? email,
          role,
          createdAt: Date.now(),
          recoveredAt: Date.now(),
        };
        await setDoc(doc(db, "users", credential.user.uid), recoveredProfile);
        metadata = recoveredProfile;
      }

      // IMPORTANT
      // restore role from metadata
      // not from selected UI role

      const resolvedRole =
        metadata?.role || role;

      setUser({
        id: credential.user.uid,
        email,
        name:
          metadata?.name ||
          email,

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
        "Invalid email address or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh overflow-y-auto bg-muted flex items-start sm:items-center justify-center px-3 py-3 sm:px-4 sm:py-6">
      <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-2xl">
        {/* Logo */}
        <div className="mb-3 sm:mb-4 flex justify-center">
          <Logo size="lg" />
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Welcome to LumiPool
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Access your energy operations dashboard
          </p>
        </div>

        {/* Role Selector */}
        <div className="mt-4 sm:mt-5 grid grid-cols-3 gap-2 sm:gap-3">
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
                className={`min-w-0 rounded-xl sm:rounded-2xl border p-2.5 sm:p-3 transition-all ${
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-lg"
                    : "border-border bg-card hover:bg-muted"
                }`}
              >
                <Icon className="mx-auto h-5 w-5" />

                <div className="mt-1 truncate text-xs sm:text-sm font-semibold">
                  {item.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4"
        >
          {/* Phone */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Email Address
            </label>

            <input
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value.trim())
              }
              className="h-11 w-full rounded-xl border border-input bg-background px-4 text-foreground outline-none transition focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
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
                className="h-11 w-full rounded-xl border border-input bg-background px-4 pr-12 text-foreground outline-none transition focus:ring-2 focus:ring-ring"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-2.5"
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
            className="h-11 w-full rounded-xl bg-primary font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
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
