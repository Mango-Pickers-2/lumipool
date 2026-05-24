import { useEffect, useState } from "react";

import {
  createFileRoute,
  Navigate,
} from "@tanstack/react-router";

import { supabase } from "@/lib/supabase";

import { Navbar } from "@/components/Navbar";

import { BuyerDashboard } from "@/components/dashboard/BuyerDashboard";

import { SupplierDashboard } from "@/components/dashboard/SupplierDashboard";

import { InstallerDashboard } from "@/components/dashboard/InstallerDashboard";

import { useLumiStore } from "@/store/lumipool";

export const Route = createFileRoute(
  "/dashboard"
)({
  head: () => ({
    meta: [
      {
        title: "Dashboard — LumiPool",
      },
      {
        name: "description",
        content:
          "Your LumiPool operational dashboard.",
      },
    ],
  }),

  component: DashboardPage,
});

function DashboardPage() {
  const user = useLumiStore(
    (s) => s.currentUser
  );

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  useEffect(() => {
    async function validateSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log(session);

      setCheckingAuth(false);
    }

    validateSession();
  }, []);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />

      <main className="mx-auto max-w-[1440px] px-8 py-8">
        {user.role === "buyer" && (
          <BuyerDashboard />
        )}

        {user.role === "supplier" && (
          <SupplierDashboard />
        )}

        {user.role === "installer" && (
          <InstallerDashboard />
        )}
      </main>
    </div>
  );
}