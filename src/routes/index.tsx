import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, MapPin, Users, Wrench } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LumiPool — Reliable Solar Power, Made Simple" },
      { name: "description", content: "Join a community solar pool to unlock wholesale prices on tier-one solar bundles. Escrow-protected, smart-routed installs." },
      { property: "og:title", content: "LumiPool — Reliable Solar Power, Made Simple" },
      { property: "og:description", content: "Group-buying solar bundles with bank-grade escrow protection." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground">
            <a href="#" className="hover:text-primary">Home</a>
            <a href="#how" className="hover:text-primary">How it Works</a>
            <a href="#pools" className="hover:text-primary">Solar Pools</a>
            <a href="#pricing" className="hover:text-primary">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="outline">Sign In</Button></Link>
            <Link to="/login"><Button>Get Started</Button></Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-[1440px] px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Introducing group-buying for clean energy
            </div>
            <h1 className="text-6xl font-bold tracking-tight leading-[1.05] text-foreground">
              Reliable Solar Power<br />
              <span className="text-primary">Made Simple.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Join a community pool to unlock wholesale prices on tier-one solar bundles.
              Secure escrow, smart-routed installation, and zero hardware risk.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/login">
                <Button size="lg" className="h-14 px-8 text-base rounded-full shadow-elevated">
                  Find My Bundle <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full">
                  Join a Solar Pool
                </Button>
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-xl">
              <Feature icon={ShieldCheck} title="Escrow Locked" body="Funds released only after successful install." />
              <Feature icon={Users} title="Group Discounts" body="Up to 15% off regular hardware rates." />
              <Feature icon={Wrench} title="Premium Install" body="Vetted local solar engineers." />
            </div>
          </div>

          <PoolPreviewCard />
        </section>

        <section className="border-t border-border bg-muted/40">
          <div className="mx-auto max-w-[1440px] px-8 py-6 flex flex-wrap items-center justify-between gap-6 text-sm">
            <div className="flex items-center gap-2 text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">Smart-Routed to 50+ Verified Installers in Lagos.</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <ShieldCheck className="h-4 w-4 text-success" />
              <span className="font-medium">100% Escrow Protection.</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="font-semibold tracking-wider">OUR PARTNERS:</span>
              <span className="font-bold text-foreground">SOLAR-TECH</span>
              <span className="font-bold text-foreground">LUMEN</span>
              <span className="font-bold text-foreground">POWER-GRID</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Feature({ icon: Icon, title, body }: { icon: any; title: string; body: string }) {
  return (
    <div>
      <Icon className="h-5 w-5 text-primary mb-2" />
      <div className="font-semibold text-sm text-foreground">{title}</div>
      <div className="text-xs text-muted-foreground mt-1 leading-snug">{body}</div>
    </div>
  );
}

function PoolPreviewCard() {
  return (
    <div className="rounded-2xl bg-muted/50 p-6 shadow-elevated">
      <div className="rounded-xl bg-card p-6 border border-border">
        <div className="flex items-start justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">
            ACTIVE SOLAR POOL
          </div>
          <div className="text-xs text-muted-foreground font-medium">⏱ 2d 14h left</div>
        </div>
        <h3 className="mt-4 text-2xl font-bold text-foreground">Yaba Pool Cluster</h3>
        <p className="text-sm text-muted-foreground">5kVA Solar Micro-Bundle</p>

        <div className="mt-6">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span>Group Pool Progress</span>
            <span className="text-success">4 / 5 Buyers Joined</span>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-success rounded-full" style={{ width: "80%" }} />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-7 w-7 rounded-full bg-muted border-2 border-card" />
              ))}
            </div>
            <span className="text-muted-foreground ml-2">Need 1 more to lock group discount (-10%)</span>
          </div>
          <span className="text-primary font-medium">🔒 Zero-Risk safe-hold</span>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-card p-5 border border-border flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Estimated Bundle Price</div>
          <div className="text-xl font-bold text-foreground mt-1">
            ₦850,000 <span className="text-xs font-medium text-success">Saved ₦85,000</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Required Deposit</div>
          <div className="text-xl font-bold text-foreground mt-1">₦85,000 <span className="text-xs text-muted-foreground">(10%)</span></div>
        </div>
      </div>
    </div>
  );
}
