import { useEffect, useMemo, useState } from "react";

import {
  Upload,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { useLumiStore, formatNaira } from "@/store/lumipool";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

export function InstallerDashboard() {
  const jobs = useLumiStore((s) => s.dispatchJobs);

  const completeJob = useLumiStore(
    (s) => s.completeJob
  );

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [photo, setPhoto] =
    useState<File | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      const { data, error } = await supabase
        .from("dispatch_jobs")
        .select("*");

      console.log(data, error);
    }

    fetchJobs();
  }, []);

  const selected =
    jobs.find((j) => j.id === selectedId) ??
    jobs[0];

  const safeHold = useMemo(() => {
    return (
      jobs.filter((j) => j.status !== "complete")
        .length * 25000
    );
  }, [jobs]);

  const cleared = useMemo(() => {
    return (
      jobs.filter((j) => j.status === "complete")
        .length * 25000
    );
  }, [jobs]);

  async function uploadPhoto(file: File) {
    const { data, error } = await supabase
      .storage
      .from("installations")
      .upload(
        `jobs/${selected?.id}/${file.name}`,
        file
      );

    console.log(data, error);
  }

  return (
    <div>
      {/* dashboard content */}
    </div>
  );
}