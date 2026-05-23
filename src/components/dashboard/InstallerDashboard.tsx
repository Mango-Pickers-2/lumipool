import { useState } from "react";
import { useLumiStore, formatNaira } from "@/store/lumipool";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, CheckCircle2, Clock, MapPin, ShieldCheck } from "lucide-react";

export function InstallerDashboard() {
  const jobs = useLumiStore((s) => s.dispatchJobs);
  const completeJob = useLumiStore((s) => s.completeJob);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [checks, setChecks] = useState({ mount: false, wiring: false, test: false });
  const [photo, setPhoto] = useState<string | null>(null);

  const selected = jobs.find((j) => j.id === selectedId) ?? jobs[0];
  const safeHold = jobs.filter((j) => j.status !== "complete").length * 25000;
  const cleared = jobs.filter((j) => j.status === "complete").length * 25000;
  const pinComplete = pin.every((d) => d.length === 1);
  const allReady = pinComplete && photo && Object.values(checks).every(Boolean) && selected;

  const handlePin = (i: number, v: string) => {
    const next = [...pin];
    next[i] = v.replace(/\D/g, "").slice(0, 1);
    setPin(next);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Installer Console</h1>
        <p className="text-sm text-muted-foreground mt-1">Plaza dispatch queue, job execution, and escrow release.</p>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-8">
        <div className="rounded-2xl bg-card border border-border shadow-card p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary-soft flex items-center justify-center"><Clock className="h-6 w-6 text-primary" /></div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Waiting in Safe-Hold</div>
            <div className="text-2xl font-bold text-foreground mt-0.5">{formatNaira(safeHold)}</div>
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-border shadow-card p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-success-soft flex items-center justify-center"><CheckCircle2 className="h-6 w-6 text-success" /></div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Cleared Earnings</div>
            <div className="text-2xl font-bold text-foreground mt-0.5">{formatNaira(cleared)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <aside className="rounded-2xl bg-card border border-border shadow-card p-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Plaza Dispatch Queue</h3>
          {jobs.length === 0 && (
            <div className="text-sm text-muted-foreground py-8 text-center">
              Queue empty. Jobs appear here when a buyer pool fills.
            </div>
          )}
          <div className="space-y-2">
            {jobs.map((j) => (
              <button
                key={j.id}
                onClick={() => setSelectedId(j.id)}
                className={`w-full text-left rounded-xl p-3 border transition ${
                  (selected?.id === j.id) ? "border-primary bg-primary-soft" : "border-border bg-card hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{j.cluster}</span>
                  <span className={`text-xs ${j.status === "complete" ? "text-success" : "text-primary"}`}>
                    {j.status === "complete" ? "Done" : "Active"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.location}</div>
                <div className="text-xs text-muted-foreground">{j.units} units · {j.id}</div>
              </button>
            ))}
          </div>
        </aside>

        <section className="col-span-2 rounded-2xl bg-card border border-border shadow-card p-6">
          {!selected ? (
            <div className="text-center py-16 text-muted-foreground text-sm">
              Select a job from the queue to begin execution.
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Job Execution</div>
                  <h2 className="text-xl font-bold text-foreground mt-1">{selected.cluster} · {selected.id}</h2>
                  <div className="text-sm text-muted-foreground mt-0.5">{selected.location} · {selected.units} units</div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">
                  <ShieldCheck className="h-3 w-3" /> Escrow funded
                </span>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-bold text-foreground mb-3">QA Checklist</h3>
                <div className="space-y-2">
                  {[
                    { k: "mount", l: "Solar panel mount secured & weatherproofed" },
                    { k: "wiring", l: "Wiring tested for continuity & polarity" },
                    { k: "test", l: "Inverter load test ran for 15 minutes" },
                  ].map((c) => (
                    <label key={c.k} className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/40 cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[color:var(--primary)]"
                        checked={(checks as any)[c.k]}
                        onChange={(e) => setChecks({ ...checks, [c.k]: e.target.checked })}
                      />
                      <span className="text-sm text-foreground">{c.l}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-bold text-foreground mb-3">Upload Proof of Work</h3>
                <label className="block rounded-xl border-2 border-dashed border-border hover:border-primary bg-muted/30 px-6 py-10 text-center cursor-pointer transition">
                  <Upload className="h-7 w-7 mx-auto text-muted-foreground" />
                  <div className="mt-2 text-sm font-semibold text-foreground">
                    {photo ? "Photo attached ✓" : "Drop installation photo or click to upload"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">JPG, PNG up to 10MB</div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setPhoto(e.target.files?.[0]?.name ?? null)}
                  />
                </label>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-bold text-foreground mb-3">Customer Sign-Off PIN</h3>
                <p className="text-xs text-muted-foreground mb-3">Ask the customer to enter their 4-digit confirmation code to release escrow.</p>
                <div className="flex gap-3">
                  {pin.map((d, i) => (
                    <Input
                      key={i}
                      value={d}
                      onChange={(e) => handlePin(i, e.target.value)}
                      maxLength={1}
                      className="h-14 w-14 text-center text-xl font-bold"
                    />
                  ))}
                </div>
              </div>

              <Button
                disabled={!allReady || selected.status === "complete"}
                onClick={() => completeJob(selected.id)}
                className="w-full mt-6 h-12 rounded-full"
              >
                {selected.status === "complete" ? "Escrow Released ✓" : "Release Escrow & Mark Complete"}
              </Button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
