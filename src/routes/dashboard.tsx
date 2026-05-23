import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { useLumiStore } from "@/store/lumipool";
import { BuyerDashboard } from "@/components/dashboard/BuyerDashboard";
import { SupplierDashboard } from "@/components/dashboard/SupplierDashboard";
import { InstallerDashboard } from "@/components/dashboard/InstallerDashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — LumiPool" },
      { name: "description", content: "Your LumiPool operational dashboard." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const user = useLumiStore((s) => s.currentUser);
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />
      <main className="mx-auto max-w-[1440px] px-8 py-8">
        {user.role === "buyer" && <BuyerDashboard />}
        {user.role === "supplier" && <SupplierDashboard />}
        {user.role === "installer" && <InstallerDashboard />}
      </main>
    </div>
  );
}
