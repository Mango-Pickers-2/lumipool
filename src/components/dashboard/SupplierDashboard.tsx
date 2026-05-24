import { useEffect, useMemo } from "react";

import {
  Activity,
  Package,
  CheckCircle2,
  TrendingUp,
  LucideIcon,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { useLumiStore } from "@/store/lumipool";

import { Button } from "@/components/ui/button";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
  tone: "success" | "primary";
}

export function SupplierDashboard() {
  const network = useLumiStore((s) =>
    s.networkState.filter(
      (n) => n.type === "supplier"
    )
  );

  const orders = useLumiStore(
    (s) => s.purchaseOrders
  );

  const confirmInventory = useLumiStore(
    (s) => s.confirmInventory
  );

  const me = network[0];

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from("purchase_orders")
        .select("*");

      console.log(data, error);
    }

    fetchOrders();
  }, []);

  const avgLoad = useMemo(() => {
    if (!network.length) return 0;

    return Math.round(
      network.reduce(
        (a, b) => a + b.capacityLoad,
        0
      ) / network.length
    );
  }, [network]);

  if (!me) {
    return null;
  }

  return (
    <div>
      {/* supplier dashboard content */}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: StatCardProps) {
  const tones: Record<string, string> = {
    success: "bg-success-soft text-success",
    primary: "bg-primary-soft text-primary",
  };

  return (
    <div className="rounded-2xl bg-card border border-border shadow-card p-5">
      <div
        className={`h-9 w-9 rounded-lg flex items-center justify-center ${tones[tone]}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        {label}
      </div>

      <div className="mt-1 text-2xl font-bold text-foreground">
        {value}
      </div>

      <div className="text-xs text-muted-foreground mt-1">
        {sub}
      </div>
    </div>
  );
}