import { useState } from "react";
import { Eye, EyeOff, User, Package, Wrench } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import PhoneInput, { isValidPhoneNumber, type Value } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useLumiStore } from "@/store/lumipool";
import type { Role } from "@/store/lumipool";

function withTimeout<T>(promise: Promise<T>, message: string, milliseconds = 15000) {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error(message)), milliseconds)),
  ]);
}

function signupErrorMessage(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  if (code.includes("email-already-in-use")) return "This email already has an account. Please sign in instead.";
  if (code.includes("invalid-email")) return "Enter a valid email address.";
  if (code.includes("weak-password")) return "Use a stronger password with at least 6 characters.";
  if (code.includes("operation-not-allowed")) return "Email/password signup is not enabled in Firebase Authentication.";
  if (code.includes("permission-denied")) return "Your account was created, but Firestore blocked the profile. Publish the supplied Firestore rules, then sign in.";
  return error instanceof Error ? error.message : "Could not create your account.";
}

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<Role>("buyer");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<Value>();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useLumiStore((s) => s.setUser);

  const roles = [
    { id: "buyer" as Role, label: "Buyer", icon: User },
    { id: "supplier" as Role, label: "Supplier", icon: Package },
    { id: "installer" as Role, label: "Installer", icon: Wrench },
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phone || !isValidPhoneNumber(phone)) {
      setError("Select a country and enter a valid phone number.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    let accountCreated = false;

    try {
      const credential = await withTimeout(createUserWithEmailAndPassword(auth, normalizedEmail, password), "Firebase Authentication did not respond. Check your internet connection and Firebase configuration.");
      accountCreated = true;
      await withTimeout(setDoc(doc(db, "users", credential.user.uid), {
        name,
        role,
        email: normalizedEmail,
        phone,
        createdAt: Date.now(),
      }), "Your account was created, but saving the Firestore profile timed out. Publish the Firestore rules, then sign in.");

      setUser({
        id: credential.user.uid,
        name,
        email: normalizedEmail,
        phone,
        role,
        balance: role === "buyer" ? 100000 : role === "supplier" ? 4800000 : 320000,
      });
      navigate("/dashboard");
    } catch (authError) {
      const message = signupErrorMessage(authError);
      setError(accountCreated && !message.includes("account was created") ? `Your account was created, but the profile could not be saved. ${message}` : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh overflow-y-auto bg-muted flex items-start sm:items-center justify-center px-3 py-3 sm:px-4 sm:py-6">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl p-4 sm:p-6 border border-border">
        <div className="flex justify-center mb-3 sm:mb-4">
          <Logo size="lg" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-1 text-foreground">
          Create your account
        </h1>
        <p className="text-center text-sm text-muted-foreground mb-4 sm:mb-5">
          Join LumiPool and get started
        </p>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
          {roles.map((item) => {
            const Icon = item.icon;
            const active = role === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setRole(item.id)}
                className={`min-w-0 p-2.5 sm:p-3 rounded-xl border transition ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="mx-auto mb-1 h-5 w-5" />
                <div className="truncate text-xs sm:text-sm font-medium">{item.label}</div>
              </button>
            );
          })}
        </div>

        <form className="space-y-3.5 sm:space-y-4" onSubmit={handleSignup}>
          <div>
            <label className="block mb-1.5 text-sm font-medium text-foreground">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Daniel Adeyemi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-foreground">
              Email Address
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
              className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-foreground">
              Phone Number
            </label>
            <PhoneInput
              international
              defaultCountry="NG"
              countryCallingCodeEditable={false}
              value={phone}
              onChange={setPhone}
              placeholder="Enter phone number"
              className="international-phone-input h-11 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-foreground">Create Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full h-11 px-3 pr-10 rounded-xl border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring" />
                <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5">
                  {showPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-foreground">Confirm Password</label>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} className="w-full h-11 px-3 pr-10 rounded-xl border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring" />
                <button type="button" aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"} onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2.5">
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
