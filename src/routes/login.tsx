import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { User, Package, Wrench, Eye, EyeOff, Phone, Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLumiStore, type Role } from "@/store/lumipool";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — LumiPool" },
      { name: "description", content: "Sign in to LumiPool as a Buyer, Supplier, or Installer." },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
  component: LoginPage,
});

const ROLES: { key: Role; label: string; icon: any }[] = [
  { key: "buyer", label: "Buyer", icon: User },
  { key: "supplier", label: "Supplier", icon: Package },
  { key: "installer", label: "Installer", icon: Wrench },
];

function LoginPage() {
  const [role, setRole] = useState<Role>("buyer");
  const [showPw, setShowPw] = useState(false);
  const login = useLumiStore((s) => s.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center px-4 py-12">
      <Link to="/" className="mb-10"><Logo size="lg" /></Link>

      <div className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-elevated p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Welcome to LumiPool</h1>
          <p className="text-sm text-muted-foreground mt-1">Choose your role to onboard.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">I am signing in as:</label>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {ROLES.map(({ key, label, icon: Icon }) => {
                const active = role === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setRole(key)}
                    className={`rounded-xl border-2 p-5 transition-all text-center ${
                      active ? "border-primary bg-primary-soft" : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <div className={`mx-auto h-10 w-10 rounded-full flex items-center justify-center ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-2 text-sm font-semibold text-foreground">{label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone Number</label>
            <div className="mt-2 relative">
              <Input defaultValue="+234 80 1234 5678" className="h-12 pl-4 pr-10" />
              <Phone className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
              <button type="button" className="text-xs font-semibold text-primary hover:underline">Forgot password?</button>
            </div>
            <div className="mt-2 relative">
              <Input type={showPw ? "text" : "password"} defaultValue="lumipool-demo" className="h-12 pl-4 pr-10" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full h-13 text-base rounded-full shadow-elevated">
            Log In
          </Button>

          <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <Lock className="h-3 w-3" /> Secured with industry-standard 256-bit encryption
          </div>
        </form>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Don't have an account? <a className="text-primary font-semibold hover:underline">Register here</a>
      </p>
    </div>
  );
}
