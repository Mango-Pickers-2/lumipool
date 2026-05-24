import { useEffect } from "react";
import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import type { LucideIcon } from "lucide-react";

import {
  Briefcase,
  ChevronRight,
  LogOut,
  MessageCircle,
  Settings,
  ShieldCheck,
  Star,
  Wrench,
  MapPin,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { useLumiStore } from "@/store/lumipool";

export default function InstallerProfile() {
  const user = useLumiStore(
    (state) => state.currentUser
  );

  const logout = useLumiStore(
    (state) => state.logout
  );

  const navigate = useNavigate();

  useEffect(() => {
    document.title =
      "Installer Profile — LumiPool";
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />

      <main className="mx-auto max-w-[1150px] px-6 py-10">
        {/* HEADER */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-primary">
              Installer Operations
            </div>

            <h1 className="mt-2 text-4xl font-bold text-foreground">
              Welcome, {user.name}
            </h1>

            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Manage installation jobs,
              dispatch operations, customer
              sign-offs, and completion
              performance across LumiPool.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-600" />
            Verified Installer
          </div>
        </div>

        {/* STATS */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <StatCard
            icon={Briefcase}
            label="Completed Installs"
            value="312 Jobs"
            sub="Verified installation handovers."
          />

          <StatCard
            icon={Star}
            label="Installer Rating"
            value="4.9 / 5.0"
            sub="Based on successful customer sign-offs."
          />
        </div>

        {/* OVERVIEW */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                🛠 Installation Overview
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Dispatch and field operations
                summary.
              </p>
            </div>

            <div className="text-xs font-mono text-muted-foreground">
              LP-INS-2291
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <InfoCard
              icon={MapPin}
              title="Current Zone"
              value="Yaba, Lagos"
              sub="4 active dispatch jobs"
            />

            <InfoCard
              icon={Wrench}
              title="Average Completion"
              value="2.4 Jobs Daily"
              sub="Fast dispatch turnaround"
            />

            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-700" />

                <span className="font-bold text-foreground">
                  Safe-Hold Verified
                </span>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Payments are released
                automatically after successful
                handover verification and
                completion approval.
              </p>
            </div>
          </div>
        </div>

        {/* MENU */}
        <div className="mt-6 space-y-3">
          <RowLink
            icon={Settings}
            label="Installer Settings"
          />

          <RowLink
            icon={MessageCircle}
            label="Support & Complaints"
            trailing={
              <span className="text-xs text-green-700">
                ● Admin Online
              </span>
            }
          />

          <LogoutButton
            handleLogout={handleLogout}
          />
        </div>
      </main>
    </div>
  );
}

/* =========================
   STAT CARD
========================= */

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {label}
          </div>

          <div className="mt-1 text-2xl font-bold text-primary">
            {value}
          </div>

          <div className="mt-2 text-xs text-muted-foreground">
            {sub}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   INFO CARD
========================= */

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  sub: string;
}

function InfoCard({
  icon: Icon,
  title,
  value,
  sub,
}: InfoCardProps) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />

        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </div>
      </div>

      <div className="mt-3 text-lg font-bold text-foreground">
        {value}
      </div>

      <div className="mt-1 text-xs text-primary">
        {sub}
      </div>
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
}

function RowLink({
  icon: Icon,
  label,
  trailing,
}: RowLinkProps) {
  return (
    <button className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-5 py-4 transition hover:bg-muted/40">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-muted-foreground" />

        <span className="font-medium text-foreground">
          {label}
        </span>
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

function LogoutButton({
  handleLogout,
}: LogoutButtonProps) {
  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center justify-between rounded-xl border border-red-200 bg-red-50 px-5 py-4 transition hover:bg-red-100"
    >
      <div className="flex items-center gap-3">
        <LogOut className="h-5 w-5 text-red-600" />

        <span className="font-semibold text-red-600">
          Log Out
        </span>
      </div>

      <ChevronRight className="h-4 w-4 text-red-600" />
    </button>
  );
}