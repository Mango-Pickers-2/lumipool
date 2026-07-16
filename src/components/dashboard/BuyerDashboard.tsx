import { useEffect, useMemo, useState } from "react";
import {
  Laptop,
  Wifi,
  Tv,
  ShieldCheck,
  Plus,
  HelpCircle,
  CheckCircle2,
  Circle,
  Truck,
  Wrench,
  LucideIcon,
} from "lucide-react";
import { doc, getDoc, runTransaction, setDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useLumiStore, formatNaira } from "@/store/lumipool";
import { WorkEvidencePanel } from "@/components/WorkEvidencePanel";
import { startPaystackPayment, verifyPaystackPayment } from "@/lib/payments";
import { PaymentCenter } from "@/components/PaymentCenter";

interface SpecProps {
  icon: LucideIcon;
  title: string;
  sub: string;
}

interface TrackerStepProps {
  done: boolean;
  active?: boolean;
  title: string;
  sub: string;
  icon: LucideIcon;
}

export function BuyerDashboard() {
  const pool = useLumiStore((s) => s.activePool);
  const stage = useLumiStore((s) => s.trackerStage);
  const joinPool = useLumiStore((s) => s.joinPool);
  const user = useLumiStore((s) => s.currentUser);
  const topUp = useLumiStore((s) => s.topUp);

  const [loading, setLoading] = useState(true);
  const [dbPool, setDbPool] = useState<any>(null);

  useEffect(() => {
    async function fetchBuyerData() {
      setLoading(true);

      // Fetch the shared pool from Firestore.
      try {
        const poolRef = doc(db, "pools", "Yaba-01");
        const snapshot = await getDoc(poolRef);
        if (!snapshot.exists()) {
          await setDoc(poolRef, {
            id: pool.id,
            cluster: pool.cluster,
            members: pool.members,
            target: pool.target,
            status: pool.status,
            bundle: pool.bundle,
            price_per_member: pool.pricePerMember,
            deposit: pool.deposit,
          });
        } else {
          setDbPool(snapshot.data());
        }
      } catch (error) {
        console.error("Could not load pool:", error);
      }

      setLoading(false);
    }

    fetchBuyerData();
  }, []);

  // Keep the shared member count safe when multiple buyers join concurrently.
  async function completePaidPoolJoin(paymentReference: string) {
    const result = await runTransaction(db, async (transaction) => {
      const poolRef = doc(db, "pools", pool.id);
      const membershipRef = doc(db, "pool_memberships", `${pool.id}_${user!.id}`);
      const membership = await transaction.get(membershipRef);
      if (membership.exists()) return { joined: false, filled: false };
      const snapshot = await transaction.get(poolRef);
      const current = snapshot.exists() ? snapshot.data() : pool;
      if (current.status === "filled") return { joined: false, filled: true };
      const members = Math.min(current.target, current.members + 1);
      const filled = members >= current.target;
      transaction.set(poolRef, { ...current, id: pool.id, members, status: filled ? "filled" : "open" });
      transaction.set(membershipRef, { poolId: pool.id, userId: user!.id, paymentReference, amount: pool.deposit, status: "active", joinedAt: Date.now() });
      transaction.set(doc(db, "safe_holds", paymentReference), { ownerId: user!.id, poolId: pool.id, amount: pool.deposit, currency: "NGN", paymentReference, status: "held", releaseCondition: "supplier-delivered-and-installation-confirmed", createdAt: Date.now() });
      return { joined: true, filled };
    });
    if (!result.joined) return;
    joinPool();

    // When filled, create the order and dispatch job in one atomic batch.
    if (result.filled) {
      const orderId = `PO-${Date.now().toString().slice(-5)}`;
      const jobId = `DJ-${Date.now().toString().slice(-5)}`;

      const batch = writeBatch(db);
      batch.set(doc(db, "purchase_orders", orderId), {
        id: orderId,
        description: `5x ${pool.bundle} | Safe-Hold Confirmed`,
        status: "safe-hold-confirmed",
        created_at: Date.now(),
      });

      batch.set(doc(db, "dispatch_jobs", jobId), {
        id: jobId,
        cluster: pool.cluster,
        location: "Yaba, Lagos",
        units: 5,
        status: "queued",
        created_at: Date.now(),
      });
      await batch.commit();
    }
  }

  async function handleJoinPool() {
    if (!user?.id || !user.email) return;
    await startPaystackPayment({ email: user.email, userId: user.id, paymentType: "buyer_pool" });
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");
    if (!reference || params.get("payment_type") !== "buyer_pool") return;
    if (sessionStorage.getItem(`verified-${reference}`)) return;
    verifyPaystackPayment(reference)
      .then(async (payment) => {
        if (payment.userId !== user?.id || payment.paymentType !== "buyer_pool") throw new Error("Payment owner mismatch");
        await completePaidPoolJoin(reference);
        sessionStorage.setItem(`verified-${reference}`, "true");
        window.history.replaceState({}, "", "/dashboard");
      })
      .catch((error) => console.error("Pool payment verification failed:", error));
  }, [user?.id]);

  const pct = useMemo(() => {
    if (!pool || pool.target <= 0) return 0;
    return (pool.members / pool.target) * 100;
  }, [pool]);

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">Loading dashboard...</div>
    );
  }

  if (!user || !pool) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">Loading dashboard...</div>
    );
  }

  return (
    <div>
      <PaymentCenter user={user} />
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Buyer Hub
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your solar pool memberships, bundles and escrow balance.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button variant="outline">
            <HelpCircle className="h-4 w-4 mr-2" />
            Support Guide
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Pool
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Bundle Recommendation */}
          <div className="rounded-2xl bg-card border border-border shadow-card p-5 md:p-7">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  Highly recommended for you
                </span>
                <h2 className="mt-4 text-xl md:text-2xl font-bold text-foreground">
                  5kVA Micro-Bundle
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Perfect for hybrid work setups.
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xs text-muted-foreground">Approx. Price</div>
                <div className="text-xl md:text-2xl font-bold text-foreground">₦450,000</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Spec icon={Laptop} title="Professional Laptop" sub="Continuous charge" />
              <Spec icon={Wifi} title="WiFi Router" sub="24/7 Connectivity" />
              <Spec icon={Tv} title="LED Smart TV" sub="Up to 8 hours daily" />
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="outline" className="h-12">
                Buy Alone
              </Button>
              <Button className="h-12" onClick={handleJoinPool}>
                👥 Join Solar Pool (-10%)
              </Button>
            </div>
          </div>

          {/* Active Pool */}
          <div className="rounded-2xl bg-card border border-border shadow-card p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <span className="inline-block rounded-full bg-success-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-success">
                Active Solar Pool
              </span>
              <span className="text-xs font-medium text-muted-foreground">⏱ 2d 14h left</span>
            </div>

            <h4 className="mt-3 text-lg md:text-xl font-bold text-foreground">
              {dbPool?.cluster ?? pool.cluster}
            </h4>

            <div className="mt-5">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>Group Pool Progress</span>
                <span className="text-success">
                  {dbPool?.members ?? pool.members} / {dbPool?.target ?? pool.target}
                </span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-success rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-success-soft border border-success/20 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-success flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-5 w-5 text-success-foreground" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">🔒 Zero-Risk Safe-Hold</div>
                  <div className="text-xs text-muted-foreground">Protected escrow system.</div>
                </div>
              </div>
              <Button
                onClick={handleJoinPool}
                disabled={pool.status === "filled"}
                className="w-full md:w-auto bg-success hover:bg-success/90"
              >
                {pool.status === "filled" ? "Pool Locked" : "Join Pool"}
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Wallet */}
          <div className="rounded-2xl bg-card border border-border shadow-card p-5 md:p-6">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              My LumiWallet
            </div>
            <div className="rounded-xl bg-muted/60 p-5 text-center">
              <div className="text-xs text-muted-foreground">Current Balance</div>
              <div className="text-2xl md:text-3xl font-bold text-foreground mt-1">
                {formatNaira(user.balance)}
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => topUp(50000)}>
              <Plus className="h-4 w-4 mr-2" />
              Top Up Wallet
            </Button>
          </div>

          {/* Tracker */}
          <div className="rounded-2xl bg-card border border-border shadow-card p-5 md:p-6">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-5">
              Real-Time Tracker
            </div>
            <ol className="space-y-5">
              <TrackerStep
                done={stage >= 1}
                title="Pool Completed"
                sub="Awaiting group lock."
                icon={CheckCircle2}
              />
              <TrackerStep
                done={stage >= 2}
                active={stage === 2}
                title="Order Triggered"
                sub="Supplier release initialized."
                icon={CheckCircle2}
              />
              <TrackerStep
                done={stage >= 3}
                active={stage === 3}
                title="Dispatching"
                sub="Equipment in transit."
                icon={Truck}
              />
              <TrackerStep
                done={stage >= 4}
                active={stage === 4}
                title="Setup & Handover"
                sub="Installation in progress."
                icon={Wrench}
              />
            </ol>
          </div>
        </div>
      </div>
      {user.id && <div className="mt-6"><WorkEvidencePanel role="buyer" userId={user.id} /></div>}
    </div>
  );
}

function Spec({ icon: Icon, title, sub }: SpecProps) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4 text-center min-h-[120px]">
      <Icon className="h-6 w-6 mx-auto text-primary mb-2" />
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <div className="text-xs text-primary mt-0.5">{sub}</div>
    </div>
  );
}

function TrackerStep({ done, active, title, sub, icon: Icon }: TrackerStepProps) {
  const color = done
    ? "text-success bg-success-soft"
    : active
      ? "text-primary bg-primary-soft"
      : "text-muted-foreground bg-muted";

  return (
    <li className="flex items-start gap-3">
      <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${color}`}>
        {done ? <Icon className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
      </div>
      <div>
        <div className="text-sm font-bold tracking-wide">{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
      </div>
    </li>
  );
}
