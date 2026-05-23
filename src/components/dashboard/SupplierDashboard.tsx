import { useLumiStore } from "@/store/lumipool";
import { Button } from "@/components/ui/button";
import { Activity, Package, CheckCircle2, TrendingUp } from "lucide-react";

export function SupplierDashboard() {
  const network = useLumiStore((s) => s.networkState.filter((n) => n.type === "supplier"));
  const me = network[0];
  const avgLoad = Math.round(network.reduce((a, b) => a + b.capacityLoad, 0) / network.length);
  const orders = useLumiStore((s) => s.purchaseOrders);
  const confirmInventory = useLumiStore((s) => s.confirmInventory);

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Supplier Operations</h1>
          <p className="text-sm text-muted-foreground mt-1">Inventory dispatch, group-buy fulfillment, and escrow settlement.</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">
        <StatCard icon={Activity} label="Your Capacity Load" value={`${me.capacityLoad}%`} sub={`Network avg ${avgLoad}%`} tone={me.capacityLoad < avgLoad ? "success" : "primary"} />
        <StatCard icon={Package} label="Pending Orders" value={String(orders.filter(o => o.status === "safe-hold-confirmed").length)} sub="Awaiting confirmation" tone="primary" />
        <StatCard icon={CheckCircle2} label="Fulfilled (30d)" value="128" sub="100% on-time rate" tone="success" />
        <StatCard icon={TrendingUp} label="Settled Revenue" value="₦48.2M" sub="+12% vs last cycle" tone="success" />
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Network Status</h2>
            <p className="text-xs text-muted-foreground">Live load-balancer view across regional suppliers.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" /> Smart-dispatch engine active
          </span>
        </div>
        <div className="space-y-3">
          {network.map((n) => (
            <div key={n.id} className="flex items-center gap-4">
              <div className="w-40 text-sm font-medium text-foreground">{n.name} <span className="text-muted-foreground">· {n.location}</span></div>
              <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${n.capacityLoad > 70 ? "bg-destructive" : n.capacityLoad > 50 ? "bg-primary" : "bg-success"}`} style={{ width: `${n.capacityLoad}%` }} />
              </div>
              <div className="w-12 text-right text-sm font-semibold text-foreground">{n.capacityLoad}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Active Purchase Orders</h2>
          <span className="text-xs text-muted-foreground">{orders.length} live</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-6 py-3 font-semibold">Order ID</th>
              <th className="text-left px-6 py-3 font-semibold">Description</th>
              <th className="text-left px-6 py-3 font-semibold">Status</th>
              <th className="text-right px-6 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground text-sm">
                No active orders. When a buyer pool reaches capacity, dispatch jobs will appear here instantly.
              </td></tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-6 py-4 font-mono text-xs font-medium text-foreground">{o.id}</td>
                <td className="px-6 py-4 text-foreground">{o.description}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${o.status === "safe-hold-confirmed" ? "bg-success-soft text-success" : "bg-primary-soft text-primary"}`}>
                    {o.status === "safe-hold-confirmed" ? "🔒 Safe-Hold Confirmed" : "📦 Picked Up"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    size="sm"
                    disabled={o.status !== "safe-hold-confirmed"}
                    onClick={() => confirmInventory(o.id)}
                  >
                    {o.status === "safe-hold-confirmed" ? "Confirm Inventory & Trigger Pickup" : "Awaiting Courier"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, tone }: any) {
  const tones: Record<string, string> = {
    success: "bg-success-soft text-success",
    primary: "bg-primary-soft text-primary",
  };
  return (
    <div className="rounded-2xl bg-card border border-border shadow-card p-5">
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
      <div className="mt-1 text-2xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}
