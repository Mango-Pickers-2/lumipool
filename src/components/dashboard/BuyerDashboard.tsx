import { useLumiStore, formatNaira } from "@/store/lumipool";
import { Button } from "@/components/ui/button";
import { Laptop, Wifi, Tv, ShieldCheck, Plus, HelpCircle, CheckCircle2, Circle, Truck, Wrench } from "lucide-react";

export function BuyerDashboard() {
  const pool = useLumiStore((s) => s.activePool);
  const stage = useLumiStore((s) => s.trackerStage);
  const joinPool = useLumiStore((s) => s.joinPool);
  const user = useLumiStore((s) => s.currentUser)!;
  const topUp = useLumiStore((s) => s.topUp);

  const pct = (pool.members / pool.target) * 100;

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Buyer Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your solar pool memberships, bundles and escrow balance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline"><HelpCircle className="h-4 w-4 mr-2" /> Support Guide</Button>
          <Button><Plus className="h-4 w-4 mr-2" /> Create New Pool</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Bundle Card */}
          <div className="rounded-2xl bg-card border border-border shadow-card p-7">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  Highly recommended for you
                </span>
                <h2 className="mt-4 text-2xl font-bold text-foreground">$500 Micro-Bundle</h2>
                <p className="text-sm text-muted-foreground mt-1">Perfect for hybrid work setups. Powers basic appliances, lighting, and networking.</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Approx. Price</div>
                <div className="text-2xl font-bold text-foreground">₦450,000</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Spec icon={Laptop} title="1x Professional Laptop" sub="Continuous charge" />
              <Spec icon={Wifi} title="1x WiFi Router" sub="24/7 Connectivity" />
              <Spec icon={Tv} title="LED Smart TV + Decoders" sub="Up to 8 hours daily" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12">Buy Alone</Button>
              <Button className="h-12">👥 Join a Solar Pool (-10%)</Button>
            </div>
          </div>

          {/* Pool */}
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
              🌐 Trending Pools In Lagos State
            </h3>
            <div className="rounded-2xl bg-card border border-border shadow-card p-6">
              <div className="flex items-start justify-between">
                <span className="inline-block rounded-full bg-success-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-success">
                  Active Solar Pool
                </span>
                <span className="text-xs font-medium text-muted-foreground">⏱ 2d 14h left</span>
              </div>
              <h4 className="mt-3 text-xl font-bold text-foreground">{pool.cluster}</h4>
              <p className="text-sm text-muted-foreground">{pool.bundle} • Standard Installation included</p>

              <div className="mt-5">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span>Group Pool Progress</span>
                  <span className="text-success">{pool.members} / {pool.target} Buyers Joined</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-success rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {Array.from({ length: pool.members }).map((_, i) => (
                      <div key={i} className="h-7 w-7 rounded-full bg-muted border-2 border-card" />
                    ))}
                  </div>
                  <span className="text-muted-foreground ml-2">
                    {pool.status === "filled" ? "✅ Pool locked. Order triggered." : `Need ${pool.target - pool.members} more to lock group discount (-10%)`}
                  </span>
                </div>
                <span className="text-primary font-medium">🔒 Zero-Risk safe-hold</span>
              </div>

              <div className="mt-6 rounded-xl bg-success-soft border border-success/20 p-4 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-success flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5 text-success-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">🔒 Zero-Risk safe-hold</div>
                    <div className="text-xs text-muted-foreground">Your deposit is fully held in secure escrow. Released only when the entire group locks in.</div>
                  </div>
                </div>
                <Button
                  onClick={joinPool}
                  disabled={pool.status === "filled"}
                  className="bg-success hover:bg-success/90 text-success-foreground rounded-full"
                >
                  {pool.status === "filled" ? "Pool Locked" : `Join Pool & Pay 10% Deposit`}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-card border border-border shadow-card p-6">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">My LumiWallet</div>
            <div className="rounded-xl bg-muted/60 p-5 text-center">
              <div className="text-xs text-muted-foreground">Current Active Balance</div>
              <div className="text-3xl font-bold text-foreground mt-1">{formatNaira(user.balance)}</div>
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => topUp(50000)}>
              <Plus className="h-4 w-4 mr-2" /> Top Up Escrow Wallet
            </Button>
            <label className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
              <input type="checkbox" defaultChecked className="mt-0.5 accent-[color:var(--primary)]" />
              <div>
                <span className="font-semibold text-foreground">Authorize 10% deposit.</span>
                <br />Automatically secure your spot when you choose to join any local pool cluster.
              </div>
            </label>
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-card p-6">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-5">Real-Time Tracker</div>
            <ol className="space-y-5">
              <TrackerStep done={stage >= 1 || pool.status === "filled"} title="Pool Completed" sub={pool.status === "filled" ? `Group hit ${pool.target}/${pool.target} members. Funds captured.` : "Awaiting group lock."} icon={CheckCircle2} />
              <TrackerStep done={stage >= 2} title="Order Triggered" sub="Hardware release initialized from supplier." icon={CheckCircle2} active={stage === 2} />
              <TrackerStep done={stage >= 3} title="Dispatching" sub="In transit with local premium courier." icon={Truck} active={stage === 3} />
              <TrackerStep done={stage >= 4} title="Setup & Handover" sub="On-site professional installation and test." icon={Wrench} active={stage === 4} />
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ icon: Icon, title, sub }: any) {
  return (
    <div className="rounded-xl bg-muted/40 border border-border p-4 text-center">
      <Icon className="h-6 w-6 mx-auto text-primary mb-2" />
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <div className="text-xs text-primary mt-0.5">{sub}</div>
    </div>
  );
}

function TrackerStep({ done, active, title, sub, icon: Icon }: any) {
  const color = done ? "text-success bg-success-soft" : active ? "text-primary bg-primary-soft" : "text-muted-foreground bg-muted";
  return (
    <li className="flex items-start gap-3">
      <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${color}`}>
        {done ? <Icon className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
      </div>
      <div>
        <div className={`text-sm font-bold uppercase tracking-wide ${done ? "text-success" : active ? "text-primary" : "text-foreground"}`}>{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
      </div>
    </li>
  );
}
