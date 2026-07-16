import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadWorkEvidence } from "@/lib/cloudinary";
import type { Role } from "@/store/lumipool";

export type WorkReportType = "buyer-completion" | "buyer-monthly-check" | "buyer-issue" | "installer-maintenance";

const reportLabels: Record<WorkReportType, string> = {
  "buyer-completion": "Buyer installation confirmation",
  "buyer-monthly-check": "Buyer monthly system check",
  "buyer-issue": "Buyer reported an installation issue",
  "installer-maintenance": "Installer maintenance evidence",
};

export async function submitWorkReport(input: {
  type: WorkReportType;
  file: File;
  submittedBy: string;
  submittedByRole: Role;
  jobId?: string;
  notes?: string;
}) {
  const referenceId = input.jobId || `${input.submittedBy}-${Date.now()}`;
  const category = input.type === "installer-maintenance" ? "maintenance" : input.type === "buyer-issue" ? "issues" : "buyer-checks";
  const proof = await uploadWorkEvidence(input.file, category, referenceId);
  const createdAt = Date.now();
  const status = input.type === "buyer-issue" ? "open" : "submitted";

  const report = await addDoc(collection(db, "work_reports"), {
    ...input,
    imageUrl: proof.secureUrl,
    imagePublicId: proof.publicId,
    status,
    createdAt,
  });

  await addDoc(collection(db, "notifications"), {
    recipientRole: input.submittedByRole === "buyer" ? "installer" : "buyer",
    title: reportLabels[input.type],
    message: input.notes || "New photo evidence is ready for review.",
    reportId: report.id,
    jobId: input.jobId || null,
    read: false,
    createdAt,
  });

  return report.id;
}

export async function ensureMonthlyRoutineReminder(userId: string, role: Role) {
  if (role === "supplier") return;
  const now = new Date();
  const monthKey = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  await setDoc(doc(db, "notifications", `routine-${userId}-${monthKey}`), {
    recipientRole: role,
    recipientUserId: userId,
    title: "Monthly solar system check",
    message: role === "buyer" ? "Inspect your installation and upload a photo, or report any problem you notice." : "Complete scheduled maintenance and upload fresh photo evidence.",
    read: false,
    kind: "monthly-routine",
    createdAt: Date.now(),
  }, { merge: true });
}
