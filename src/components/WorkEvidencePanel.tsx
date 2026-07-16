import { useState } from "react";
import { Camera, CheckCircle2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitWorkReport, type WorkReportType } from "@/lib/workflow";
import type { Role } from "@/store/lumipool";

interface WorkEvidencePanelProps {
  role: "buyer" | "installer";
  userId: string;
  jobId?: string;
}

export function WorkEvidencePanel({ role, userId, jobId }: WorkEvidencePanelProps) {
  const [type, setType] = useState<WorkReportType>(role === "buyer" ? "buyer-completion" : "installer-maintenance");
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async () => {
    if (!file) return;
    setSubmitting(true);
    setMessage("");
    try {
      await submitWorkReport({ type, file, notes: notes.trim(), submittedBy: userId, submittedByRole: role as Role, jobId });
      setFile(null);
      setNotes("");
      setMessage(type === "buyer-issue" ? "Issue sent to the installer." : "Photo evidence submitted successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not submit the report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          {role === "buyer" ? <Camera className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
        </div>
        <div>
          <h2 className="font-bold text-foreground">{role === "buyer" ? "Installation & Routine Checks" : "Maintenance Evidence"}</h2>
          <p className="mt-1 text-xs text-muted-foreground">Upload a clear photo so the other party can review the work.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {role === "buyer" ? (
          <select value={type} onChange={(event) => setType(event.target.value as WorkReportType)} className="h-11 rounded-xl border border-input bg-background px-3 text-sm">
            <option value="buyer-completion">Installation completed</option>
            <option value="buyer-monthly-check">Monthly routine check</option>
            <option value="buyer-issue">Report an installation problem</option>
          </select>
        ) : (
          <select value={type} onChange={(event) => setType(event.target.value as WorkReportType)} className="h-11 rounded-xl border border-input bg-background px-3 text-sm">
            <option value="installer-maintenance">Maintenance / routine check</option>
          </select>
        )}

        <label className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-dashed border-primary/40 bg-primary/5 px-3 text-sm font-medium text-primary hover:bg-primary/10">
          <Camera className="mr-2 h-4 w-4" />
          <span className="truncate">{file ? file.name : "Choose photo"}</span>
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => setFile(event.target.files?.[0] || null)} />
        </label>
      </div>

      <textarea value={notes} onChange={(event) => setNotes(event.target.value)} required={type === "buyer-issue"} placeholder={type === "buyer-issue" ? "Describe what is wrong and where it happened..." : "Add an optional note about the work..."} className="mt-3 min-h-20 w-full resize-y rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" />

      <Button className="mt-3 w-full sm:w-auto" disabled={!file || submitting || (type === "buyer-issue" && !notes.trim())} onClick={submit}>
        {submitting ? "Uploading..." : "Submit photo report"}
      </Button>

      {message && <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-success" />{message}</p>}
    </section>
  );
}
