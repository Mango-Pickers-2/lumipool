import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
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
  const user = useLumiStore((state) => state.currentUser);
  const logout = useLumiStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Installer Profile — LumiPool";
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openSupportChat = () => {
    window.$chatwoot?.toggle("open");
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-safe">
      <Navbar />

      <main className="mx-auto max-w-[1150px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* HEADER */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-primary">
              Installer Operations
            </div>

            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
              Welcome, {user.name}
            </h1>

            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Manage installation jobs, dispatch operations and completion tracking.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-xs font-semibold text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-600" />
            Verified Installer
          </div>
        </div>

        {/* STATS */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <StatCard
            icon={Briefcase}
            label="Completed Installs"
            value="312 Jobs"
            sub="Verified installation handovers"
          />

          <StatCard
            icon={Star}
            label="Installer Rating"
            value="4.9 / 5.0"
            sub="Based on customer sign-off"
          />
        </div>

        {/* OVERVIEW */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold">Installation Overview</h2>
              <p className="text-sm text-muted-foreground mt-1">Dispatch and field summary</p>
            </div>

            <div className="text-xs font-mono text-muted-foreground">LP-INS-2291</div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <InfoCard icon={MapPin} title="Current Zone" value="Yaba, Lagos" sub="4 active jobs" />

            <InfoCard
              icon={Wrench}
              title="Completion Rate"
              value="2.4 Daily"
              sub="Field performance"
            />

            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-700" />
                <span className="font-bold">Safe-Hold Active</span>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Payments release after verified completion
              </p>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 space-y-3">
          <RowLink icon={Settings} label="Installer Settings" />

          <RowLink
            icon={MessageCircle}
            label="Support & Complaints"
            onClick={openSupportChat}
            trailing={<span className="text-xs text-green-700">● Admin Online</span>}
          />

          <LogoutButton handleLogout={handleLogout} />
        </div>
      </main>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

function StatCard({ icon: Icon, label, value, sub }: any) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 rounded-full bg-primary text-white flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <div className="text-xs uppercase font-bold text-muted-foreground">{label}</div>

          <div className="mt-1 text-2xl font-bold text-primary">{value}</div>

          <div className="mt-2 text-xs text-muted-foreground">{sub}</div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, value, sub }: any) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />

        <div className="text-xs uppercase font-semibold text-muted-foreground">{title}</div>
      </div>

      <div className="mt-3 text-lg font-bold">{value}</div>

      <div className="mt-1 text-xs text-primary">{sub}</div>
    </div>
  );
}

function RowLink({ icon: Icon, label, trailing, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-5 py-4"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium">{label}</span>
      </div>

      <div className="flex items-center gap-3">
        {trailing}
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </button>
  );
}

function LogoutButton({ handleLogout }: any) {
  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center justify-between rounded-xl border border-red-200 bg-red-50 px-5 py-4"
    >
      <div className="flex items-center gap-3">
        <LogOut className="h-5 w-5 text-red-600" />
        <span className="font-semibold text-red-600">Log Out</span>
      </div>

      <ChevronRight className="h-4 w-4 text-red-600" />
    </button>
  );
}
