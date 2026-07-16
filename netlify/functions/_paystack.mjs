export const paymentProducts = {
  buyer_pool: { label: "Solar pool safe-hold contribution", amount: Number(process.env.PAYSTACK_BUYER_POOL_AMOUNT || 8500000) },
  buyer_maintenance: { label: "Solar maintenance payment", amount: Number(process.env.PAYSTACK_MAINTENANCE_AMOUNT || 1500000) },
  supplier_onboarding: { label: "Supplier onboarding fee", amount: Number(process.env.PAYSTACK_SUPPLIER_ONBOARDING_AMOUNT || 5000000) },
  installer_onboarding: { label: "Installer onboarding fee", amount: Number(process.env.PAYSTACK_INSTALLER_ONBOARDING_AMOUNT || 2500000) },
};

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

export async function paystack(path, options = {}) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("PAYSTACK_SECRET_KEY is not configured");
  const response = await fetch(`https://api.paystack.co${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json", ...options.headers },
  });
  const result = await response.json();
  if (!response.ok || !result.status) throw new Error(result.message || "Paystack request failed");
  return result.data;
}
