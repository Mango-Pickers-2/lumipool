import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { useLumiStore } from "@/store/lumipool";
import { Button } from "@/components/ui/button";
import { Droplet, Zap, Star, Briefcase, Settings, MessageCircle, LogOut, TrendingUp, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — LumiPool" },
      { name: "description", content: "Your LumiPool account and impact overview." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const user = useLumiStore((s) => s.currentUser);
  const logout = useLumiStore((s) => s.logout);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" />;

  const handleLogout = () => { logout(); navigate({ to: "/login" }); };

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />
      <main className="mx-auto max-w-[1100px] px-8 py-10">
        <div className="text-xs font-bold uppercase tracking-wider text-primary">LumiPool Account Overview</div>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Welcome, {user.name}.</h1>
          <span className="inline-flex items-center gap-2 rounded-full bg-success-soft px-4 py-1.5 text-sm font-semibold text-success">
            <span className="h-2 w-2 rounded-full bg-success" /> Active Eco Saver
          </span>
        </div>

        <div className="mt-8 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {user.role === "buyer" ? "Your Renewable Energy Impact" : "Your Lifetime Performance"}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-5">
          {user.role === "buyer" && (
            <>
              <ImpactCard tone="success" icon={Droplet} label="Estimated Petrol Costs Saved" value="₦45,000 Saved" sub="Based on typical generator runtimes in Lagos during grid outages." />
              <ImpactCard tone="primary" icon={Zap} label="Productivity Safe-Guard" value="120 Hours Saved" sub="Uninterrupted continuous power for remote work & office connectivity." />
            </>
          )}
          {user.role === "supplier" && (
            <>
              <ImpactCard tone="primary" icon={Briefcase} label="Lifetime Orders Fulfilled" value="1,248 Units" sub="Across 32 group pool clusters in Lagos & Abuja." />
              <ImpactCard tone="success" icon={Star} label="Reliability Score" value="4.9 / 5.0" sub="100% on-time hardware release rate." />
            </>
          )}
          {user.role === "installer" && (
            <>
              <ImpactCard tone="primary" icon={Briefcase} label="Lifetime Jobs Fulfilled" value="312 Installs" sub="Avg 2.4 jobs per dispatch window." />
              <ImpactCard tone="success" icon={Star} label="Average Customer Rating" value="4.9 / 5.0" sub="Based on 312 verified handover sign-offs." />
            </>
          )}
        </div>

        <div className="mt-6 rounded-2xl bg-card border border-border shadow-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-foreground">⚙️ My System Details</span>
            </div>
            <div className="text-xs font-mono text-muted-foreground">ID: LP-90812-YAB</div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-muted/40 border border-border p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Assigned Professional Installer</div>
              <div className="text-base font-bold text-foreground mt-1">Chinedu O.</div>
              <div className="text-xs text-warning mt-1">★★★★★</div>
            </div>
            <div className="rounded-xl bg-muted/40 border border-border p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Hardware Warranty</div>
              <div className="text-base font-bold text-foreground mt-1">23 Months Remaining</div>
              <div className="text-xs text-success mt-1">100% Guaranteed Cover</div>
            </div>
            <div className="flex items-center justify-center">
              <Button variant="outline" className="w-full"><TrendingUp className="h-4 w-4 mr-2" /> Request Upgrade</Button>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <RowLink icon={Settings} label="Account Settings" />
          <RowLink icon={MessageCircle} label="Support Chat" trailing={<span className="text-xs text-success">● Support online</span>} />
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between rounded-xl bg-destructive/5 border border-destructive/20 hover:bg-destructive/10 px-5 py-4 transition"
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-destructive" />
              <span className="font-semibold text-destructive">Log Out</span>
            </div>
            <ChevronRight className="h-4 w-4 text-destructive" />
          </button>
        </div>
      </main>
    </div>
  );
}

function ImpactCard({ icon: Icon, label, value, sub, tone }: any) {
  const tones: Record<string, string> = {
    success: "bg-success-soft border-success/20",
    primary: "bg-primary-soft border-primary/20",
  };
  const dot: Record<string, string> = {
    success: "bg-success text-success-foreground",
    primary: "bg-primary text-primary-foreground",
  };
  const text: Record<string, string> = {
    success: "text-success",
    primary: "text-primary",
  };
  return (
    <div className={`rounded-2xl border p-6 ${tones[tone]}`}>
      <div className="flex items-start gap-4">
        <div className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 ${dot[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground">{label}</div>
          <div className={`text-2xl font-bold mt-1 ${text[tone]}`}>{value}</div>
          <div className="text-xs text-muted-foreground mt-2 leading-snug">{sub}</div>
        </div>
      </div>
    </div>
  );
}

function RowLink({ icon: Icon, label, trailing }: any) {
  return (
    <button className="w-full flex items-center justify-between rounded-xl bg-card border border-border hover:bg-muted/40 px-5 py-4 transition">
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
