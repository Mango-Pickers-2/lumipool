const MAX_PROOF_SIZE = 10 * 1024 * 1024;

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
}

export async function uploadInstallationProof(
  file: File,
  jobId: string,
): Promise<CloudinaryUploadResult> {
  return uploadWorkEvidence(file, "installations", jobId);
}

export async function uploadWorkEvidence(
  file: File,
  category: "installations" | "maintenance" | "buyer-checks" | "issues",
  referenceId: string,
): Promise<CloudinaryUploadResult> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary is not configured. Add the cloud name and unsigned upload preset.");
  }
  if (!file.type.startsWith("image/")) throw new Error("Proof of work must be an image.");
  if (file.size > MAX_PROOF_SIZE) throw new Error("The proof image must be smaller than 10 MB.");

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", uploadPreset);
  body.append("folder", `lumipool/${category}/${referenceId}`);
  body.append("tags", `lumipool,work-evidence,${category},reference-${referenceId}`);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body,
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.secure_url || !result?.public_id) {
    throw new Error(result?.error?.message || "Cloudinary could not upload the proof image.");
  }
  return { secureUrl: result.secure_url, publicId: result.public_id };
}
