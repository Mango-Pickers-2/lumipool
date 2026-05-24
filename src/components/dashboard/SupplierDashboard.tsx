import { useEffect, useMemo, useState } from "react";
import {
  Activity, Package, CheckCircle2,
  TrendingUp, ShieldCheck, LucideIcon,
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
  const networkState = useLumiStore((s) => s.networkState);
  const zustandOrders = useLumiStore((s) => s.purchaseOrders);
  const confirmInventory = useLumiStore((s) => s.confirmInventory);

  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const network = useMemo(
    () => networkState.filter((n) => n.type === "supplier"),
    [networkState]
  );

  const me = network[0];

  // Merge Supabase orders + Zustand orders (deduplicated by id)
  const orders = useMemo(() => {
    const map = new Map<string, any>();
    dbOrders.forEach((o) =>
      map.set(o.id, {
        ...o,
        createdAt: o.created_at,
      })
    );
    zustandOrders.forEach((o) => {
      if (!map.has(o.id)) map.set(o.id, o);
    });
    return Array.from(map.values());
  }, [dbOrders, zustandOrders]);

  useEffect(() => {
    async function fetchOrders() {
      setLoadingOrders(true);
      const { data, error } = await supabase
        .from("purchase_orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setDbOrders(data);
      }
      setLoadingOrders(false);
    }
    fetchOrders();
  }, []);

  async function handleConfirmInventory(orderId: string) {
    // Update Supabase
    const { error } = await supabase
      .from("purchase_orders")
      .update({ status: "picked-up" })
      .eq("id", orderId);

    if (error) {
      console.error("Failed to confirm inventory:", error.message);
      return;
    }

    // Update local DB state
    setDbOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "picked-up" } : o
      )
    );

    // Sync Zustand
    confirmInventory(orderId);
  }

  const avgLoad = useMemo(() => {
    if (!network.length) return 0;
    return Math.round(
      network.reduce((a, b) => a + b.capacityLoad, 0) / network.length
    );
  }, [network]);

  const fulfilledOrders = useMemo(
    () => orders.filter((o) => o.status === "picked-up"),
    [orders]
  );

  if (!me) return null;

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Supplier Hub
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor purchase orders, inventory releases and network load.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-success-soft px-4 py-2 text-sm font-semibold text-success">
          <Activity className="h-4 w-4" /> {me.capacityLoad}% Capacity
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        <StatCard
          icon={Package}
          label="Lifetime Units"
          value="1,248"
          sub="Across 32 pool clusters"
          tone="primary"
        />
        <StatCard
          icon={CheckCircle2}
          label="Orders Fulfilled"
          value={`${fulfilledOrders.length + 147}`}
          sub="This month"
          tone="success"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Network Load"
          value={`${avgLoad}%`}
          sub="Across all supplier nodes"
          tone="primary"
        />
        <StatCard
          icon={ShieldCheck}
          label="Reliability Score"
          value="4.9 / 5.0"
          sub="100% on-time release rate"
          tone="success"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Purchase Orders */}
        <div className="col-span-2 space-y-4">
          <div className="rounded-2xl bg-card border border-border shadow-card p-6">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-5">
              Active Purchase Orders
            </div>

            {loadingOrders ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-xl bg-muted/40 border border-border p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      PO-90812 · 5x 5kVA Solar Micro-Bundle
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Safe-Hold Confirmed · Awaiting inventory release
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                    Pending
                  </span>
                </div>
                <div className="mt-4">
                  <Button size="sm" variant="outline" disabled>
                    Confirm Inventory
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-xl bg-muted/40 border border-border p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-foreground">
                          {order.id} · {order.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(order.createdAt).toLocaleDateString("en-NG", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        order.status === "picked-up"
                          ? "bg-success-soft text-success"
                          : "bg-primary-soft text-primary"
                      }`}>
                        {order.status === "picked-up" ? "Fulfilled" : "Pending Release"}
                      </span>
                    </div>

                    {order.status === "safe-hold-confirmed" && (
                      <div className="mt-4">
                        <Button
                          size="sm"
                          onClick={() => handleConfirmInventory(order.id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Confirm Inventory Release
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Network Nodes */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-card border border-border shadow-card p-6">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-5">
              Supplier Network
            </div>
            <div className="space-y-3">
              {network.map((node) => (
                <div
                  key={node.id}
                  className="rounded-xl bg-muted/40 border border-border p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-foreground">
                      {node.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {node.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          node.capacityLoad > 70
                            ? "bg-destructive"
                            : node.capacityLoad > 50
                            ? "bg-primary"
                            : "bg-success"
                        }`}
                        style={{ width: `${node.capacityLoad}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground w-8 text-right">
                      {node.capacityLoad}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, tone }: StatCardProps) {
  const tones: Record<string, string> = {
    success: "bg-success-soft text-success",
    primary: "bg-primary-soft text-primary",
  };
  return (
    <div className="rounded-2xl bg-card border border-border shadow-card p-5">
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}