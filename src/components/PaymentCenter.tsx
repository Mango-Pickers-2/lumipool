import { useEffect, useState } from "react";
import { CreditCard, ShieldCheck } from "lucide-react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { startPaystackPayment, verifyPaystackPayment, type PaymentType } from "@/lib/payments";
import type { CurrentUser } from "@/store/lumipool";

export function PaymentCenter({ user }: { user: CurrentUser }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const onboardingType: PaymentType = user.role === "supplier" ? "supplier_onboarding" : "installer_onboarding";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");
    const paymentType = params.get("payment_type") as PaymentType | null;
    if (!reference || !paymentType || paymentType === "buyer_pool" || sessionStorage.getItem(`verified-${reference}`)) return;
    verifyPaystackPayment(reference).then(async (payment) => {
      if (payment.userId !== user.id || payment.paymentType !== paymentType) throw new Error("Payment owner mismatch");
      await setDoc(doc(db, "payments", reference), { ...payment, ownerId: user.id, status: "verified", createdAt: Date.now() });
      if (paymentType === "supplier_onboarding" || paymentType === "installer_onboarding") {
        await updateDoc(doc(db, "users", user.id!), { onboardingPaymentStatus: "paid", onboardingPaymentReference: reference });
      }
      sessionStorage.setItem(`verified-${reference}`, "true");
      window.history.replaceState({}, "", "/dashboard");
      setMessage("Payment verified successfully.");
    }).catch((error) => setMessage(error instanceof Error ? error.message : "Payment verification failed."));
  }, [user.id]);

  const pay = async (paymentType: PaymentType) => {
    if (!user.id || !user.email) return;
    setLoading(true);
    setMessage("");
    try {
      await startPaystackPayment({ email: user.email, userId: user.id, paymentType });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not start payment.");
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
        <div className="flex-1">
          <h2 className="font-bold">LumiPool Payments</h2>
          <p className="mt-1 text-xs text-muted-foreground">Pay securely through Paystack. Pool contributions are recorded in the LumiPool safe-hold ledger after server verification.</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            {user.role === "buyer" ? (
              <Button size="sm" variant="outline" disabled={loading} onClick={() => pay("buyer_maintenance")}><CreditCard className="mr-2 h-4 w-4" />Pay maintenance fee</Button>
            ) : (
              <Button size="sm" disabled={loading} onClick={() => pay(onboardingType)}><CreditCard className="mr-2 h-4 w-4" />Pay {user.role} onboarding fee</Button>
            )}
          </div>
          {message && <p className="mt-2 text-xs font-medium text-primary">{message}</p>}
        </div>
      </div>
    </section>
  );
}
