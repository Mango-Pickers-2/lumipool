import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { BuyerDashboard } from "@/components/dashboard/BuyerDashboard";
import { SupplierDashboard } from "@/components/dashboard/SupplierDashboard";
import { InstallerDashboard } from "@/components/dashboard/InstallerDashboard";
import { useLumiStore } from "@/store/lumipool";

export default function DashboardPage() {
  const user = useLumiStore((s) => s.currentUser);
  const setUser = useLumiStore((s) => s.setUser);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    document.title = "Dashboard — LumiPool";

    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "Your LumiPool operational dashboard.");
    }

    async function validateSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // If supabase has a session but Zustand lost it (e.g. page refresh),
      // restore the user from session metadata
      if (session?.user && !user) {
        const meta = session.user.user_metadata;
        if (meta?.name && meta?.role) {
          setUser({
            name: meta.name,
            role: meta.role,
            balance:
              meta.role === "buyer"
                ? 100000
                : meta.role === "supplier"
                ? 4800000
                : 320000,
          });
        }
      }

      setCheckingAuth(false);
    }

    validateSession();
  }, []);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

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