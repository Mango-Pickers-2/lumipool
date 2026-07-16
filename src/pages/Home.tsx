import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BatteryCharging,
  BellRing,
  Check,
  ChevronRight,
  CircleDollarSign,
  Grid3X3,
  MapPin,
  Menu,
  PackageCheck,
  ShieldCheck,
  SunMedium,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

const sections = [
  { id: "home", label: "Home" },
  { id: "how-it-works", label: "How It Works" },
  { id: "solar-pools", label: "Solar Pools" },
  { id: "pricing", label: "Pricing" },
] as const;

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "LumiPool — Shared Solar, Reliable Power";
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-25% 0px -55%", threshold: [0.05, 0.25, 0.5] },
    );
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
          <button onClick={() => scrollTo("home")} aria-label="Go to LumiPool home"><Logo /></button>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {sections.map((section) => (
              <button key={section.id} onClick={() => scrollTo(section.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeSection === section.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                {section.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link to="/login"><Button variant="ghost">Sign In</Button></Link>
            <Link to="/signup"><Button className="rounded-full px-5">Create Account</Button></Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-border md:hidden" aria-label="Toggle navigation">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-border bg-background p-4 md:hidden">
            <nav className="grid gap-1">
              {sections.map((section) => <button key={section.id} onClick={() => scrollTo(section.id)} className={`rounded-xl px-4 py-3 text-left text-sm font-medium ${activeSection === section.id ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}>{section.label}</button>)}
            </nav>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link to="/login"><Button variant="outline" className="w-full">Sign In</Button></Link>
              <Link to="/signup"><Button className="w-full">Sign Up</Button></Link>
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="home" className="scroll-mt-20 overflow-hidden">
          <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-[1280px] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:px-8 lg:py-20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                <SunMedium className="h-4 w-4" /> Community-powered clean energy
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-7xl">
                Reliable solar power, <span className="text-primary">made affordable together.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                LumiPool brings buyers, verified suppliers, and local installers into one transparent solar journey—from group purchasing and payment protection to installation evidence and monthly maintenance.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/signup"><Button size="lg" className="h-13 w-full rounded-full px-7 sm:w-auto">Join LumiPool <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                <button onClick={() => scrollTo("how-it-works")} className="flex h-13 items-center justify-center rounded-full border border-border px-7 text-sm font-semibold hover:bg-muted">See how it works <ChevronRight className="ml-1 h-4 w-4" /></button>
              </div>
              <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
                <TrustPoint icon={ShieldCheck} title="Protected workflow" text="Verified before fulfilment" />
                <TrustPoint icon={Users} title="Group savings" text="Pool demand for better value" />
                <TrustPoint icon={BellRing} title="Clear updates" text="Track every handoff" />
              </div>
            </div>

            <PoolHeroCard />
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 border-y border-border bg-muted/30 py-20 sm:py-24">
          <SectionHeading eyebrow="One connected workflow" title="From interest to installed solar" description="Every participant sees the next action, the supporting evidence, and the status of the pool." />
          <div className="mx-auto mt-12 grid max-w-[1280px] gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            <StepCard number="01" icon={Users} title="Join a local pool" text="Buyers choose a suitable bundle and combine demand with nearby participants." />
            <StepCard number="02" icon={CircleDollarSign} title="Confirm contribution" text="Paystack verifies the payment and LumiPool records the contribution in its safe-hold workflow." />
            <StepCard number="03" icon={PackageCheck} title="Supply and install" text="Verified suppliers release equipment and routed installers complete the work." />
            <StepCard number="04" icon={ShieldCheck} title="Verify and maintain" text="Photo evidence, buyer confirmation, issue reports, and routine checks keep the system accountable." />
          </div>
        </section>

        <section id="solar-pools" className="scroll-mt-20 py-20 sm:py-24">
          <SectionHeading eyebrow="Built around real communities" title="A smarter way to access dependable power" description="Shared panels and pooled purchasing reduce entry cost, while each household keeps its own solar box and battery system." />
          <div className="mx-auto mt-12 grid max-w-[1280px] gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <PoolCard location="Yaba, Lagos" bundle="5kVA Community Bundle" progress={80} members="4 of 5 buyers" status="Almost full" />
            <PoolCard location="Surulere, Lagos" bundle="3.5kVA Starter Bundle" progress={60} members="3 of 5 buyers" status="Open" />
            <PoolCard location="Ikeja, Lagos" bundle="10kVA Business Bundle" progress={42} members="5 of 12 businesses" status="Building" />
          </div>

          <div className="mx-auto mt-10 grid max-w-[1280px] gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            <Benefit icon={Grid3X3} title="Shared generation" text="Community-scale panels serve pooled demand across a defined local cluster." />
            <Benefit icon={BatteryCharging} title="Individual storage" text="Each participant retains a dedicated battery and solar control box." />
            <Benefit icon={MapPin} title="Distance-aware routing" text="Installers are matched to nearby jobs for faster service and lower travel cost." />
            <Benefit icon={Wrench} title="Routine maintenance" text="Buyers and installers upload monthly evidence and report issues inside the app." />
          </div>
        </section>

        <section id="pricing" className="scroll-mt-20 border-t border-border bg-slate-950 py-20 text-white sm:py-24">
          <SectionHeading dark eyebrow="Simple participation" title="Clear fees for every LumiPool role" description="Start in test mode today. Final commercial fees and payout terms will be confirmed before live operations." />
          <div className="mx-auto mt-12 grid max-w-[1120px] gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <PricingCard role="Buyer" price="₦85,000" period="pool deposit" featured features={["Join a local solar pool", "Track order and installation", "Upload completion evidence", "Report issues and routine checks"]} />
            <PricingCard role="Supplier" price="₦50,000" period="onboarding fee" features={["Access verified pool demand", "Manage purchase orders", "Confirm inventory release", "Receive workflow notifications"]} />
            <PricingCard role="Installer" price="₦25,000" period="onboarding fee" features={["Receive routed installation jobs", "Upload installation evidence", "Record maintenance visits", "Track completed assignments"]} />
          </div>
          <p className="mx-auto mt-8 max-w-2xl px-4 text-center text-xs leading-5 text-slate-400">Maintenance is currently configured at ₦15,000 per service cycle. Displayed prices are test-stage defaults and may change before commercial launch.</p>
        </section>

        <section className="bg-primary px-4 py-14 text-primary-foreground sm:px-6">
          <div className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
            <div><h2 className="text-2xl font-bold sm:text-3xl">Ready to power your home differently?</h2><p className="mt-2 text-sm text-primary-foreground/80 sm:text-base">Join a local solar pool and follow every step from payment to maintenance.</p></div>
            <Link to="/signup"><Button size="lg" variant="secondary" className="rounded-full px-8">Create your account <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
          <div className="lg:col-span-2"><Logo /><p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">LumiPool coordinates shared solar purchasing, verified fulfilment, local installation, and long-term maintenance for communities seeking dependable clean energy.</p><div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-primary" /> Lagos, Nigeria</div></div>
          <FooterColumn title="Platform" links={[{ label: "How It Works", target: "how-it-works" }, { label: "Solar Pools", target: "solar-pools" }, { label: "Pricing", target: "pricing" }]} onNavigate={scrollTo} />
          <FooterColumn title="Accounts" links={[{ label: "Buyer Signup", href: "/signup" }, { label: "Supplier Signup", href: "/signup" }, { label: "Installer Signup", href: "/signup" }, { label: "Sign In", href: "/login" }]} onNavigate={scrollTo} />
          <div><h3 className="text-sm font-bold">Contact</h3><div className="mt-4 grid gap-3 text-sm text-muted-foreground"><a href="mailto:hello@lumipool.app" className="hover:text-primary">hello@lumipool.app</a><a href="mailto:support@lumipool.app" className="hover:text-primary">Support & complaints</a><span>Mon–Fri, 9am–5pm WAT</span></div></div>
        </div>
        <div className="border-t border-border"><div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-5 text-xs text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8"><span>© {new Date().getFullYear()} LumiPool. Clean energy, shared intelligently.</span><div className="flex flex-wrap gap-5"><a href="mailto:privacy@lumipool.app" className="hover:text-foreground">Privacy</a><a href="mailto:legal@lumipool.app" className="hover:text-foreground">Terms</a><button onClick={() => scrollTo("how-it-works")} className="hover:text-foreground">Onboarding Guide</button></div></div></div>
      </footer>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description, dark = false }: { eyebrow: string; title: string; description: string; dark?: boolean }) {
  return <div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><div className={`text-xs font-bold uppercase tracking-[0.16em] ${dark ? "text-blue-400" : "text-primary"}`}>{eyebrow}</div><h2 className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${dark ? "text-white" : "text-foreground"}`}>{title}</h2><p className={`mt-4 leading-7 ${dark ? "text-slate-400" : "text-muted-foreground"}`}>{description}</p></div>;
}

function TrustPoint({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div><div><div className="text-xs font-bold">{title}</div><div className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{text}</div></div></div>;
}

function PoolHeroCard() {
  return <div className="relative mx-auto w-full max-w-lg"><div className="absolute -inset-6 rounded-[2.5rem] bg-primary/10 blur-3xl" /><div className="relative rounded-[2rem] border border-border bg-card p-5 shadow-2xl sm:p-7"><div className="flex items-center justify-between"><span className="rounded-full bg-success-soft px-3 py-1 text-xs font-bold text-success">ACTIVE POOL</span><span className="text-xs text-muted-foreground">Yaba Cluster</span></div><h3 className="mt-5 text-2xl font-bold">5kVA Solar Micro-Bundle</h3><p className="mt-1 text-sm text-muted-foreground">Shared generation · Individual battery storage</p><div className="mt-7 flex items-end justify-between"><div><div className="text-xs text-muted-foreground">Pool progress</div><div className="mt-1 text-lg font-bold">4 of 5 buyers</div></div><div className="text-right"><div className="text-xs text-muted-foreground">Contribution</div><div className="mt-1 text-lg font-bold text-primary">₦85,000</div></div></div><div className="mt-3 h-3 overflow-hidden rounded-full bg-muted"><div className="h-full w-4/5 rounded-full bg-gradient-to-r from-primary to-blue-400" /></div><div className="mt-6 grid grid-cols-3 gap-2"><MiniStat value="15%" label="Pool saving" /><MiniStat value="2d 14h" label="Time left" /><MiniStat value="Verified" label="Installer" /></div><div className="mt-5 rounded-2xl border border-success/20 bg-success/5 p-4 text-sm"><div className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4 text-success" /> Payment protection active</div><p className="mt-1 text-xs leading-5 text-muted-foreground">Contribution is tracked through fulfilment and installation confirmation.</p></div></div></div>;
}

function MiniStat({ value, label }: { value: string; label: string }) { return <div className="rounded-xl bg-muted/60 p-3 text-center"><div className="text-xs font-bold sm:text-sm">{value}</div><div className="mt-1 text-[10px] text-muted-foreground">{label}</div></div>; }
function StepCard({ number, icon: Icon, title, text }: { number: string; icon: LucideIcon; title: string; text: string }) { return <article className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div><span className="text-sm font-bold text-muted-foreground/50">{number}</span></div><h3 className="mt-5 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></article>; }
function PoolCard({ location, bundle, progress, members, status }: { location: string; bundle: string; progress: number; members: string; status: string }) { return <article className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><MapPin className="h-3.5 w-3.5 text-primary" />{location}</span><span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">{status}</span></div><h3 className="mt-5 text-lg font-bold">{bundle}</h3><div className="mt-6 flex justify-between text-xs"><span className="text-muted-foreground">{members}</span><span className="font-bold">{progress}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} /></div><Link to="/signup" className="mt-5 flex items-center text-sm font-semibold text-primary">Join this pool <ArrowRight className="ml-1 h-4 w-4" /></Link></article>; }
function Benefit({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) { return <div className="rounded-2xl bg-muted/40 p-5"><Icon className="h-5 w-5 text-primary" /><h3 className="mt-4 text-sm font-bold">{title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p></div>; }
function PricingCard({ role, price, period, features, featured = false }: { role: string; price: string; period: string; features: string[]; featured?: boolean }) { return <article className={`rounded-3xl border p-6 ${featured ? "border-blue-400 bg-blue-500/10" : "border-slate-800 bg-slate-900"}`}><div className="flex items-center justify-between"><h3 className="font-bold">{role}</h3>{featured && <span className="rounded-full bg-blue-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">Most popular</span>}</div><div className="mt-6 text-3xl font-bold">{price}</div><div className="mt-1 text-xs text-slate-400">{period}</div><ul className="mt-6 grid gap-3">{features.map((feature) => <li key={feature} className="flex items-start gap-2 text-sm text-slate-300"><Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />{feature}</li>)}</ul><Link to="/signup"><Button className="mt-7 w-full rounded-full" variant={featured ? "default" : "secondary"}>Get started</Button></Link></article>; }

function FooterColumn({ title, links, onNavigate }: { title: string; links: Array<{ label: string; target?: string; href?: string }>; onNavigate: (id: string) => void }) {
  return <div><h3 className="text-sm font-bold">{title}</h3><div className="mt-4 grid gap-3 text-sm text-muted-foreground">{links.map((link) => link.href ? <Link key={link.label} to={link.href} className="hover:text-primary">{link.label}</Link> : <button key={link.label} onClick={() => onNavigate(link.target!)} className="text-left hover:text-primary">{link.label}</button>)}</div></div>;
}
