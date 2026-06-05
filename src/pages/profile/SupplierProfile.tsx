import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  LogOut,
  MessageCircle,
  Package,
  Settings,
  ShieldCheck,
  Star,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { useLumiStore } from "@/store/lumipool";

export default function SupplierProfile() {
  const user = useLumiStore((s) => s.currentUser);
  const logout = useLumiStore((s) => s.logout);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Supplier Profile — LumiPool";
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />

      <main className="mx-auto max-w-[1150px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-primary">
              Supplier Network
            </div>

            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">
              Hello, {user?.name}.
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Manage inventory releases, supplier performance and fulfillment operations.
            </p>
          </div>

          <div className="rounded-full bg-primary-soft px-4 py-2 text-sm font-semibold text-primary">
            Verified Supplier
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          <StatCard
            icon={Package}
            label="Orders Fulfilled"
            value="1,248 Units"
            sub="Across active solar pool clusters."
          />

          <StatCard
            icon={Star}
            label="Supplier Rating"
            value="4.9 / 5.0"
            sub="Based on verified delivery releases."
          />
        </div>

        {/* Operations */}
        <div className="mt-6 rounded-2xl border bg-card p-6 shadow-card">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-bold text-foreground">📦 Supplier Operations</div>

              <p className="text-sm text-muted-foreground mt-1">
                Current network and logistics overview.
              </p>
            </div>

            <div className="text-xs font-mono text-muted-foreground">LP-SUP-1038</div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard
              title="Inventory Status"
              value="92% Available"
              sub="Healthy warehouse stock"
            />

            <InfoCard title="Network Coverage" value="Lagos & Abuja" sub="32 active clusters" />

            <div className="rounded-xl bg-success-soft border border-success/20 p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-success" />

                <span className="font-bold text-foreground">Escrow Protected</span>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Supplier releases are protected through LumiPool Safe-Hold verification.
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="mt-6 space-y-3">
          <RowLink icon={Settings} label="Supplier Settings" />

          <RowLink
            icon={MessageCircle}
            label="Support & Complaints"
            trailing={<span className="text-xs text-success">● Admin Online</span>}
          />

          <LogoutButton handleLogout={handleLogout} />
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }: any) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary-soft p-6">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
            {label}
          </div>

          <div className="mt-1 text-2xl font-bold text-primary">{value}</div>

          <div className="mt-2 text-xs text-muted-foreground">{sub}</div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, value, sub }: any) {
  return (
    <div className="rounded-xl bg-muted/40 border border-border p-5">
      <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
        {title}
      </div>

      <div className="mt-2 text-lg font-bold text-foreground">{value}</div>

      <div className="mt-1 text-xs text-primary">{sub}</div>
    </div>
  );
}

function RowLink({ icon: Icon, label, trailing }: any) {
  return (
    <button className="w-full flex items-center justify-between gap-3 rounded-xl bg-card border border-border hover:bg-muted/40 px-5 py-4 transition">
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

function LogoutButton({ handleLogout }: any) {
  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 px-5 py-4 transition"
    >
      <div className="flex items-center gap-3">
        <LogOut className="h-5 w-5 text-destructive" />

        <span className="font-semibold text-destructive">Log Out</span>
      </div>

      <ChevronRight className="h-4 w-4 text-destructive" />
    </button>
  );
}
