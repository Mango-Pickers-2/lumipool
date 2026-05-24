import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import {
  ChevronRight,
  Droplet,
  LogOut,
  MessageCircle,
  Settings,
  ShieldCheck,
  TrendingUp,
  User,
  Wallet,
  Wrench,
  Package,
  Zap,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";

import { supabase } from "@/lib/supabase";
import { useLumiStore } from "@/store/lumipool";

export default function Profile() {
  const user = useLumiStore((s) => s.currentUser);
  const logout = useLumiStore((s) => s.logout);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Profile — LumiPool";

    const meta = document.querySelector(
      'meta[name="description"]'
    );

    if (meta) {
      meta.setAttribute(
        "content",
        "Manage your LumiPool account, wallet, clean energy activity and support."
      );
    }
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();

    logout();

    navigate("/login");
  };

  const getRoleTitle = () => {
    switch (user.role) {
      case "buyer":
        return "Buyer";
      case "supplier":
        return "Supplier";
      case "installer":
        return "Installer";
      default:
        return "User";
    }
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case "buyer":
        return <User className="h-5 w-5" />;
      case "supplier":
        return <Package className="h-5 w-5" />;
      case "installer":
        return <Wrench className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getRoleStatus = () => {
    switch (user.role) {
      case "buyer":
        return "Active Buyer";
      case "supplier":
        return "Verified Supplier";
      case "installer":
        return "Certified Installer";
      default:
        return "Active User";
    }
  };

  const goToRoleProfile = () => {
    if (user.role === "buyer") {
      navigate("/buyer-profile");
    }

    if (user.role === "supplier") {
      navigate("/supplier-profile");
    }

    if (user.role === "installer") {
      navigate("/installer-profile");
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />

      <main className="mx-auto max-w-[1200px] px-6 py-10">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              {getRoleIcon()}
              LumiPool {getRoleTitle()} Account
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground">
              Welcome back, {user.name}
            </h1>

            <p className="mt-3 max-w-2xl text-muted-foreground">
              Manage your LumiPool account, clean energy participation,
              escrow protection, transactions and operational activity
              across the platform.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-5 py-3 text-sm font-semibold text-success border border-success/20">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            {getRoleStatus()}
          </div>
        </div>

        {/* STATS */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatsCard
            icon={Wallet}
            label="Wallet Balance"
            value={`₦${user.balance.toLocaleString()}`}
            sub="Current operational balance"
            tone="primary"
          />

          <StatsCard
            icon={Zap}
            label="Energy Impact"
            value="124 kWh"
            sub="Shared solar contribution"
            tone="success"
          />

          <StatsCard
            icon={Droplet}
            label="Fuel Savings"
            value="₦45,000"
            sub="Estimated diesel savings"
            tone="warning"
          />

          <StatsCard
            icon={ShieldCheck}
            label="Protection Status"
            value="Secured"
            sub="Escrow & warranty active"
            tone="info"
          />
        </div>

        {/* ACCOUNT OVERVIEW */}
        <div className="mt-8 rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Account Overview
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Centralized operational summary for your LumiPool activity.
                </p>
              </div>

              <div className="rounded-xl bg-muted px-4 py-2 text-xs font-mono text-muted-foreground">
                LP-{user.role.toUpperCase()}-2048
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 p-8">
            <OverviewCard
              title="Current Role"
              value={getRoleTitle()}
              sub="Your operational access level"
            />

            <OverviewCard
              title="Verification"
              value="Verified"
              sub="KYC & identity confirmed"
            />

            <OverviewCard
              title="Platform Status"
              value="Operational"
              sub="All services functioning normally"
            />
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-foreground">
            Quick Actions
          </h2>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ActionCard
              icon={TrendingUp}
              title="Open Dashboard"
              description="View your role-based operational dashboard."
              onClick={() => navigate("/dashboard")}
            />

            <ActionCard
              icon={User}
              title="Role Profile"
              description="Manage your role-specific information and settings."
              onClick={goToRoleProfile}
            />

            <ActionCard
              icon={Settings}
              title="Account Settings"
              description="Update security, notifications and preferences."
            />

            <ActionCard
              icon={MessageCircle}
              title="Support & Complaints"
              description="Reach LumiPool support instantly through Chatwoot."
            />
          </div>
        </div>

        {/* SECURITY */}
        <div className="mt-8 rounded-3xl border border-success/20 bg-success/5 p-8">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-success text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground">
                Secure Transaction Protection
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-3xl">
                LumiPool protects all buyer, supplier and installer
                transactions using escrow-based payment holding,
                verified installation workflows and operational
                confirmation before final settlement release.
              </p>

              <Button className="mt-5">
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* LOGOUT */}
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between rounded-2xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 px-6 py-5 transition"
          >
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-full bg-destructive text-white flex items-center justify-center">
                <LogOut className="h-5 w-5" />
              </div>

              <div className="text-left">
                <div className="font-semibold text-destructive">
                  Log Out
                </div>

                <div className="text-sm text-muted-foreground">
                  End your current LumiPool session securely.
                </div>
              </div>
            </div>

            <ChevronRight className="h-5 w-5 text-destructive" />
          </button>
        </div>
      </main>
    </div>
  );
}

function StatsCard({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: any) {
  const toneStyles: Record<string, string> = {
    primary: "border-primary/20 bg-primary/5",
    success: "border-success/20 bg-success/5",
    warning: "border-yellow-500/20 bg-yellow-500/5",
    info: "border-blue-500/20 bg-blue-500/5",
  };

  return (
    <div
      className={`rounded-2xl border p-6 ${toneStyles[tone]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
            {label}
          </div>

          <div className="mt-2 text-3xl font-bold text-foreground">
            {value}
          </div>

          <div className="mt-2 text-sm text-muted-foreground">
            {sub}
          </div>
        </div>

        <div className="h-12 w-12 rounded-full bg-background border border-border flex items-center justify-center">
          <Icon className="h-5 w-5 text-foreground" />
        </div>
      </div>
    </div>
  );
}

function OverviewCard({
  title,
  value,
  sub,
}: any) {
  return (
    <div className="rounded-2xl border border-border bg-muted/30 p-6">
      <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
        {title}
      </div>

      <div className="mt-2 text-2xl font-bold text-foreground">
        {value}
      </div>

      <div className="mt-2 text-sm text-muted-foreground">
        {sub}
      </div>
    </div>
  );
}

function ActionCard({
  icon: Icon,
  title,
  description,
  onClick,
}: any) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-border bg-card hover:bg-muted/40 transition p-6 text-left"
    >
      <div className="flex items-start justify-between">
        <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>

        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition" />
      </div>

      <div className="mt-5">
        <div className="text-lg font-bold text-foreground">
          {title}
        </div>

        <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </div>
      </div>
    </button>
  );
}