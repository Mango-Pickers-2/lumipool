import { json, paymentProducts, paystack } from "./_paystack.mjs";

export default async (request) => {
  if (request.method !== "GET") return json({ error: "Method not allowed" }, 405);
  try {
    const reference = new URL(request.url).searchParams.get("reference");
    if (!reference) return json({ error: "Payment reference is required" }, 400);
    const data = await paystack(`/transaction/verify/${encodeURIComponent(reference)}`);
    const paymentType = data.metadata?.payment_type;
    const product = paymentProducts[paymentType];
    const verified = data.status === "success" && product && data.amount === product.amount && data.currency === "NGN";
    if (!verified) return json({ error: "Payment is not successful or the amount does not match" }, 400);
    return json({ verified: true, reference: data.reference, paymentType, amount: data.amount, paidAt: data.paid_at, userId: data.metadata?.user_id });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Could not verify payment" }, 500);
  }
};
