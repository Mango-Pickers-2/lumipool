import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

import { Navbar } from "@/components/Navbar";

import { BuyerDashboard } from "@/components/dashboard/BuyerDashboard";
import { SupplierDashboard } from "@/components/dashboard/SupplierDashboard";
import { InstallerDashboard } from "@/components/dashboard/InstallerDashboard";

import { useLumiStore } from "@/store/lumipool";
import { ensureMonthlyRoutineReminder } from "@/lib/workflow";

export default function Dashboard() {
  const user = useLumiStore((state) => state.currentUser);
  const setUser = useLumiStore((state) => state.setUser);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard — LumiPool";

    const metaDescription = document.querySelector('meta[name="description"]');

    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Manage your LumiPool operations, energy participation and network activity.",
      );
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser || user) return;
        const snapshot = await getDoc(doc(db, "users", firebaseUser.uid));
        const profile = snapshot.data();
        const role = profile?.role ?? "buyer";
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email ?? undefined,
          phone: profile?.phone,
          name: profile?.name ?? "LumiPool User",
          role,
          balance: role === "buyer" ? 100000 : role === "supplier" ? 4800000 : 320000,
        });
      } catch (error) {
        console.error("Dashboard session restore error:", error);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [setUser, user]);

  useEffect(() => {
    if (user?.id) {
      ensureMonthlyRoutineReminder(user.id, user.role).catch((error) =>
        console.error("Could not create monthly routine reminder:", error),
      );
    }
  }, [user?.id, user?.role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />

          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-muted/20 overflow-x-hidden">
      <Navbar />

      <main className="mx-auto w-full max-w-[1440px] px-3 py-4 sm:px-6 md:py-8 lg:px-8 overflow-x-hidden">
        {user.role === "buyer" && <BuyerDashboard />}

        {user.role === "supplier" && <SupplierDashboard />}

        {user.role === "installer" && <InstallerDashboard />}
      </main>
    </div>
  );
}
