import { useEffect, useMemo, useState } from "react";
import {
  Upload,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Wrench,
  Package,
  Star,
  MessageCircle,
  Phone,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useLumiStore, formatNaira } from "@/store/lumipool";
import { Button } from "@/components/ui/button";

import "@/lib/chatwoot";

export function InstallerDashboard() {
  const zustandJobs = useLumiStore((s) => s.dispatchJobs);
  const completeJob = useLumiStore((s) => s.completeJob);
  const user = useLumiStore((s) => s.currentUser);

  const [dbJobs, setDbJobs] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Load Chatwoot only here
  useEffect(() => {
    const existingScript = document.getElementById("chatwoot-script");

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "chatwoot-script";
      script.src = "https://app.chatwoot.com/packs/js/sdk.js";
      script.async = true;

      document.body.appendChild(script);

      script.onload = () => {
        if (window.chatwootSDK) {
          window.chatwootSDK.run({
            websiteToken: "3wXxWoUecNeHPsLbcrmFucQn",
            baseUrl: "https://app.chatwoot.com",
          });
        }
      };
    }

    return () => {
      if (window.$chatwoot) {
        window.$chatwoot.toggle("close");
      }
    };
  }, []);

  // Merge Supabase + Zustand jobs
  const jobs = useMemo(() => {
    const map = new Map<string, any>();

    dbJobs.forEach((j) =>
      map.set(j.id, {
        ...j,
        createdAt: j.created_at,
      })
    );

    zustandJobs.forEach((j) => {
      if (!map.has(j.id)) map.set(j.id, j);
    });

    return Array.from(map.values());
  }, [dbJobs, zustandJobs]);

  const selected = jobs.find((j) => j.id === selectedId) ?? jobs[0];

  useEffect(() => {
    async function fetchJobs() {
      setLoadingJobs(true);

      const { data, error } = await supabase
        .from("dispatch_jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setDbJobs(data);
      }

      setLoadingJobs(false);
    }

    fetchJobs();
  }, []);

  const safeHold = useMemo(() => {
    return jobs.filter((j) => j.status !== "complete").length * 25000;
  }, [jobs]);

  const cleared = useMemo(() => {
    return jobs.filter((j) => j.status === "complete").length * 25000;
  }, [jobs]);

  async function handleUploadAndComplete() {
    if (!photo || !selected) return;

    setUploading(true);

    const { error: uploadError } = await supabase.storage
      .from("installations")
      .upload(`jobs/${selected.id}/${Date.now()}_${photo.name}`, photo);

    if (uploadError) {
      console.error(uploadError.message);
      setUploading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("dispatch_jobs")
      .update({ status: "complete" })
      .eq("id", selected.id);

    if (updateError) {
      console.error(updateError.message);
      setUploading(false);
      return;
    }

    setDbJobs((prev) =>
      prev.map((j) =>
        j.id === selected.id ? { ...j, status: "complete" } : j
      )
    );

    completeJob(selected.id);

    setUploading(false);
    setPhoto(null);
  }

  const statusColor = (status: string) => {
    if (status === "complete") {
      return "bg-success-soft text-success";
    }

    if (status === "in-progress") {
      return "bg-primary-soft text-primary";
    }

    return "bg-muted text-muted-foreground";
  };

  const statusLabel = (status: string) => {
    if (status === "complete") return "Complete";
    if (status === "in-progress") return "In Progress";
    return "Queued";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Installer Hub
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Manage dispatch jobs, upload handover proof and track escrow
            releases.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 text-sm font-semibold text-primary">
          <Star className="h-4 w-4" />
          4.9 Installer Rating
        </div>
      </div>

      {/* Support Panel */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />

              <h3 className="text-lg font-bold text-foreground">
                Installer Support
              </h3>
            </div>

            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Need help with verification, delayed payouts, dispatch confusion
              or customer complaints? Reach out instantly to the Lumipool team.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => {
                if (window.$chatwoot) {
                  window.$chatwoot.toggle("open");
                }
              }}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Open Live Chat
            </Button>

            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Call Admin
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5">
        <div className="rounded-2xl bg-card border border-border shadow-card p-5">
          <div className="h-10 w-10 rounded-xl bg-primary-soft flex items-center justify-center">
            <Package className="h-5 w-5 text-primary" />
          </div>

          <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Total Jobs
          </div>

          <div className="mt-1 text-3xl font-bold text-foreground">
            {jobs.length === 0 ? "312" : jobs.length}
          </div>

          <div className="text-xs text-muted-foreground mt-1">
            Completed and active dispatch assignments
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border shadow-card p-5">
          <div className="h-10 w-10 rounded-xl bg-success-soft flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-success" />
          </div>

          <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Safe-Hold Pending
          </div>

          <div className="mt-1 text-3xl font-bold text-foreground">
            {formatNaira(safeHold)}
          </div>

          <div className="text-xs text-muted-foreground mt-1">
            Releases after installation confirmation
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border shadow-card p-5">
          <div className="h-10 w-10 rounded-xl bg-success-soft flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-success" />
          </div>

          <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Cleared Earnings
          </div>

          <div className="mt-1 text-3xl font-bold text-foreground">
            {formatNaira(cleared)}
          </div>

          <div className="text-xs text-muted-foreground mt-1">
            Successfully released payouts
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Queue */}
        <div className="rounded-2xl bg-card border border-border shadow-card p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Dispatch Queue
          </div>

          <div className="space-y-3">
            {loadingJobs ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                Loading jobs...
              </div>
            ) : jobs.length === 0 ? (
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />

                  <span className="text-sm font-semibold text-foreground">
                    Yaba Pool Cluster
                  </span>
                </div>

                <div className="text-xs text-muted-foreground">
                  Yaba, Lagos · 5 units
                </div>

                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                  <Clock className="h-3 w-3" />
                  Queued
                </div>
              </div>
            ) : (
              jobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setSelectedId(job.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    selected?.id === job.id
                      ? "border-primary bg-primary-soft"
                      : "border-border bg-muted/30 hover:bg-muted/60"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary" />

                    <span className="text-sm font-semibold text-foreground">
                      {job.cluster}
                    </span>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {job.location} · {job.units} systems
                  </div>

                  <div
                    className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusColor(
                      job.status
                    )}`}
                  >
                    <Clock className="h-3 w-3" />
                    {statusLabel(job.status)}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Details */}
        <div className="col-span-2 rounded-2xl bg-card border border-border shadow-card p-6">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-5">
            Installation Handover
          </div>

          {selected ? (
            <div className="space-y-5">
              <div className="rounded-xl border border-border bg-muted/40 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-bold text-foreground">
                    {selected.cluster}
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
                      selected.status
                    )}`}
                  >
                    {statusLabel(selected.status)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Location
                    </div>

                    <div className="mt-1 font-semibold text-foreground">
                      {selected.location}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">Units</div>

                    <div className="mt-1 font-semibold text-foreground">
                      {selected.units} systems
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">Job ID</div>

                    <div className="mt-1 text-xs font-mono font-semibold text-foreground">
                      {selected.id}
                    </div>
                  </div>
                </div>
              </div>

              {/* Escrow */}
              <div className="rounded-xl bg-success-soft border border-success/20 p-5">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="h-4 w-4 text-success" />

                  <span className="text-sm font-bold text-foreground">
                    Safe-Hold Active
                  </span>
                </div>

                <div className="text-xs text-muted-foreground">
                  {formatNaira(25000)} held in escrow and released after
                  successful photo verification.
                </div>
              </div>

              {/* Upload */}
              {selected.status !== "complete" ? (
                <div className="rounded-xl border border-border p-5 space-y-4">
                  <div className="text-sm font-semibold text-foreground">
                    Upload Installation Proof
                  </div>

                  <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 transition hover:bg-muted/60">
                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />

                    <span className="text-xs text-muted-foreground">
                      {photo ? photo.name : "Click to upload photo"}
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setPhoto(e.target.files?.[0] ?? null)
                      }
                    />
                  </label>

                  <Button
                    className="w-full"
                    disabled={!photo || uploading}
                    onClick={handleUploadAndComplete}
                  >
                    <Wrench className="h-4 w-4 mr-2" />

                    {uploading
                      ? "Uploading..."
                      : "Complete Installation"}
                  </Button>
                </div>
              ) : (
                <div className="rounded-xl bg-success-soft border border-success/20 p-5 flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-success" />

                  <div>
                    <div className="text-sm font-bold text-success">
                      Installation Completed
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Payment released successfully to your LumiWallet.
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No installation jobs available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}