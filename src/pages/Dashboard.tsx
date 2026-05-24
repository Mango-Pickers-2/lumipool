import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { supabase } from "@/lib/supabase";
import { loadChatwoot } from "@/lib/chatwoot";

import { Navbar } from "@/components/Navbar";

import { BuyerDashboard } from "@/components/dashboard/BuyerDashboard";
import { SupplierDashboard } from "@/components/dashboard/SupplierDashboard";
import { InstallerDashboard } from "@/components/dashboard/InstallerDashboard";

import { useLumiStore } from "@/store/lumipool";

export default function Dashboard() {
  const user = useLumiStore((state) => state.currentUser);
  const setUser = useLumiStore((state) => state.setUser);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Page Metadata
    document.title = "Dashboard — LumiPool";

    const meta = document.querySelector(
      'meta[name="description"]'
    );

    if (meta) {
      meta.setAttribute(
        "content",
        "Manage your LumiPool operations, energy participation and network activity."
      );
    }

    // Load Chatwoot Globally
    loadChatwoot();

    // Restore Session
    async function restoreSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // No session
        if (!session?.user) {
          setLoading(false);
          return;
        }

        // Restore Zustand state after refresh
        if (!user) {
          const metadata =
            session.user.user_metadata;

          const role =
            metadata?.role || "buyer";

          setUser({
            name:
              metadata?.name ||
              "LumiPool User",

            role,

            balance:
              role === "buyer"
                ? 100000
                : role === "supplier"
                ? 4800000
                : 320000,
          });
        }
      } catch (error) {
        console.error(
          "Dashboard session restore error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />

          <p className="text-sm text-muted-foreground">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Not Authenticated
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Global Navigation */}
      <Navbar />

      {/* Dashboard Content */}
      <main className="mx-auto max-w-[1440px] px-6 py-8 lg:px-8">
        {/* Buyer Dashboard */}
        {user.role === "buyer" && (
          <BuyerDashboard />
        )}

        {/* Supplier Dashboard */}
        {user.role === "supplier" && (
          <SupplierDashboard />
        )}

        {/* Installer Dashboard */}
        {user.role === "installer" && (
          <InstallerDashboard />
        )}
      </main>
    </div>
  );
}