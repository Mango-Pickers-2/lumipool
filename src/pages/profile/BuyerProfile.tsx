import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

import {
  ChevronRight,
  Droplet,
  LogOut,
  MessageCircle,
  Settings,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useLumiStore } from "@/store/lumipool";

declare global {
  interface Window {
    $chatwoot?: {
      toggle: (state?: "open" | "close") => void;
    };
  }
}

export default function BuyerProfile() {
  const user = useLumiStore((state) => state.currentUser);
  const logout = useLumiStore((state) => state.logout);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Buyer Profile — LumiPool";
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openSupport = () => {
    window.$chatwoot?.toggle("open");
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />

      <main className="mx-auto w-full max-w-[1150px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-primary">
              Buyer Account
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Welcome back, {user.name}
            </h1>

            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Track your renewable energy participation, pool memberships, savings and installation
              progress.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-600" />
            Active Buyer
          </div>
        </div>

        {/* Impact Cards */}
        <div className="mt-6 grid gap-4 sm:gap-5 md:grid-cols-2">
          <ImpactCard
            tone="success"
            icon={Droplet}
            label="Estimated Fuel Savings"
            value="₦45,000 Saved"
            sub="Reduced petrol expenses through shared solar ownership."
          />

          <ImpactCard
            tone="primary"
            icon={Zap}
            label="Protected Productivity"
            value="120+ Hours"
            sub="Reliable power for work, connectivity and home operations."
          />
        </div>

        {/* Membership Section */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">⚡ Solar Membership</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Overview of your current LumiPool participation.
              </p>
            </div>

            <div className="text-xs font-mono text-muted-foreground">LP-BUY-2048</div>
          </div>

          <div className="mt-5 grid gap-3 sm:gap-4 md:grid-cols-3">
            <InfoCard title="Active Cluster" value="Yaba Solar Pool" sub="4 / 5 Members Joined" />

            <InfoCard
              title="Warranty Coverage"
              value="23 Months Left"
              sub="Protected hardware warranty"
            />

            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-700" />

                <span className="font-bold text-foreground">Safe-Hold Active</span>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Funds remain escrow protected until delivery, installation and handover verification
                are completed.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <Button variant="outline" className="w-full sm:w-auto">
              <TrendingUp className="mr-2 h-4 w-4" />
              Upgrade System
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <RowLink icon={Settings} label="Account Settings" />

          <RowLink
            icon={MessageCircle}
            label="Support & Complaints"
            onClick={openSupport}
            trailing={<span className="text-xs text-green-700">● Admin Online</span>}
          />

          <LogoutButton handleLogout={handleLogout} />
        </div>
      </main>
    </div>
  );
}

/* =========================
   IMPACT CARD
========================= */

interface ImpactCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
  tone: "success" | "primary";
}

function ImpactCard({ icon: Icon, label, value, sub, tone }: ImpactCardProps) {
  const cardStyle =
    tone === "success" ? "bg-green-50 border-green-200" : "bg-primary/5 border-primary/20";

  const iconStyle =
    tone === "success" ? "bg-green-600 text-white" : "bg-primary text-primary-foreground";

  const textStyle = tone === "success" ? "text-green-700" : "text-primary";

  return (
    <div className={`rounded-2xl border p-6 ${cardStyle}`}>
      <div className="flex items-start gap-3 sm:gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-full ${iconStyle}`}>
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {label}
          </div>

          <div className={`mt-1 text-xl sm:text-2xl font-bold ${textStyle}`}>{value}</div>

          <div className="mt-2 text-xs text-muted-foreground">{sub}</div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   INFO CARD
========================= */

interface InfoCardProps {
  title: string;
  value: string;
  sub: string;
}

function InfoCard({ title, value, sub }: InfoCardProps) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>

      <div className="mt-2 text-lg font-bold text-foreground">{value}</div>

      <div className="mt-1 text-xs text-primary">{sub}</div>
    </div>
  );
}

/* =========================
   ROW LINK
========================= */

interface RowLinkProps {
  icon: LucideIcon;
  label: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
}

function RowLink({ icon: Icon, label, trailing, onClick }: RowLinkProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 sm:px-5 py-4 transition active:scale-[0.98] hover:bg-muted/40"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-muted-foreground" />

        <span className="font-medium text-foreground">{label}</span>
      </div>

      <div className="flex items-center gap-3">
        {trailing}

        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </button>
  );
}

/* =========================
   LOGOUT BUTTON
========================= */

interface LogoutButtonProps {
  handleLogout: () => void;
}

function LogoutButton({ handleLogout }: LogoutButtonProps) {
  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 sm:px-5 py-4 transition active:scale-[0.98] hover:bg-red-100"
    >
      <div className="flex items-center gap-3">
        <LogOut className="h-5 w-5 text-red-600" />

        <span className="font-semibold text-red-600">Log Out</span>
      </div>

      <ChevronRight className="h-4 w-4 text-red-600" />
    </button>
  );
}
