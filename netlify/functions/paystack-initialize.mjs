import { json, paymentProducts, paystack } from "./_paystack.mjs";

export default async (request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const { email, paymentType, userId, callbackUrl } = await request.json();
    const product = paymentProducts[paymentType];
    if (!email || !userId || !product) return json({ error: "Invalid payment request" }, 400);
    const callback = new URL(callbackUrl);
    const requestOrigin = new URL(request.url).origin;
    if (callback.origin !== requestOrigin || (callback.protocol !== "https:" && callback.hostname !== "localhost")) return json({ error: "Invalid callback URL" }, 400);

    const data = await paystack("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify({
        email,
        amount: product.amount,
        currency: "NGN",
        callback_url: callback.toString(),
        metadata: { payment_type: paymentType, user_id: userId, product_label: product.label },
      }),
    });
    return json({ authorizationUrl: data.authorization_url, reference: data.reference });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Could not initialize payment" }, 500);
  }
};
