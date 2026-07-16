export type PaymentType = "buyer_pool" | "buyer_maintenance" | "supplier_onboarding" | "installer_onboarding";

export async function startPaystackPayment(input: { email: string; userId: string; paymentType: PaymentType }) {
  const callbackUrl = `${window.location.origin}/dashboard?payment_type=${input.paymentType}`;
  const response = await fetch("/.netlify/functions/paystack-initialize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, callbackUrl }),
  });
  const result = await response.json();
  if (!response.ok || !result.authorizationUrl) throw new Error(result.error || "Could not start payment");
  window.location.assign(result.authorizationUrl);
}

export async function verifyPaystackPayment(reference: string) {
  const response = await fetch(`/.netlify/functions/paystack-verify?reference=${encodeURIComponent(reference)}`);
  const result = await response.json();
  if (!response.ok || !result.verified) throw new Error(result.error || "Payment verification failed");
  return result as { verified: true; reference: string; paymentType: PaymentType; amount: number; paidAt: string; userId: string };
}
