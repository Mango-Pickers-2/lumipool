import crypto from "node:crypto";
import { json, paymentProducts } from "./_paystack.mjs";

export default async (request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const rawBody = await request.text();
  const expected = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY || "").update(rawBody).digest("hex");
  const received = request.headers.get("x-paystack-signature") || "";
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);
  if (!received || expectedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) return json({ error: "Invalid signature" }, 401);

  const event = JSON.parse(rawBody);
  if (event.event === "charge.success") {
    const product = paymentProducts[event.data.metadata?.payment_type];
    if (!product || event.data.amount !== product.amount || event.data.currency !== "NGN") return json({ error: "Amount mismatch" }, 400);
    console.log("Verified Paystack charge", JSON.stringify({ reference: event.data.reference, paymentType: event.data.metadata.payment_type, userId: event.data.metadata.user_id }));
  }
  return json({ received: true });
};
