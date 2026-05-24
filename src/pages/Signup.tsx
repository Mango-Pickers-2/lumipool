import { useState } from "react";
import { Eye, EyeOff, User, Package, Wrench } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import { supabase } from "@/lib/supabase";
import { useLumiStore } from "@/store/lumipool";
import type { Role } from "@/store/lumipool";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>("buyer");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useLumiStore((s) => s.setUser);

  const roles = [
    { id: "buyer" as Role, label: "Buyer", icon: User },
    { id: "supplier" as Role, label: "Supplier", icon: Package },
    { id: "installer" as Role, label: "Installer", icon: Wrench },
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = `${phone.replace(/\s+/g, "")}@lumipool.app`;

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role, phone },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setUser({
      name,
      role,
      balance: role === "buyer" ? 100000 : role === "supplier" ? 4800000 : 320000,
    });

    navigate("/dashboard");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl p-8 border border-border">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 text-foreground">
          Create your account
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Join LumiPool and get started
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {roles.map((item) => {
            const Icon = item.icon;
            const active = role === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setRole(item.id)}
                className={`p-4 rounded-xl border transition ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="mx-auto mb-2 h-5 w-5" />
                <div className="text-sm font-medium">{item.label}</div>
              </button>
            );
          })}
        </div>

        <form className="space-y-5" onSubmit={handleSignup}>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Daniel Adeyemi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-foreground">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="+234 80 1234 5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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

          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}