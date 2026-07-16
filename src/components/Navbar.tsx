import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wallet,
  Menu,
  X,
  User,
  LayoutDashboard,
} from "lucide-react";

import { useLumiStore, formatNaira } from "@/store/lumipool";
import { Logo } from "./Logo";
import { NotificationBell } from "./NotificationBell";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

export function Navbar() {
  const user = useLumiStore((s) => s.currentUser);

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center"
          >
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>

            {user.role === "buyer" && (
              <div className="flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 text-sm font-medium text-primary">
                <Wallet className="h-4 w-4" />
                {formatNaira(user.balance)}
              </div>
            )}

            <div className="rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize">
              {user.role}
            </div>

            <NotificationBell role={user.role} />

            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-3 rounded-full hover:bg-muted px-2 py-1 transition"
            >
              <div className="text-right">
                <div className="text-sm font-semibold">
                  {user.name}
                </div>

                <div className="text-xs text-muted-foreground capitalize">
                  {user.role} Account
                </div>
              </div>

              <Avatar className="h-10 w-10 border border-border">
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <NotificationBell role={user.role} />
            <button
              onClick={() => setOpen(!open)}
              className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {open && (
          <div className="md:hidden border-t border-border py-4 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 border border-border">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="font-semibold">
                  {user.name}
                </div>

                <div className="text-xs text-muted-foreground capitalize">
                  {user.role} Account
                </div>
              </div>
            </div>

            {user.role === "buyer" && (
              <div className="flex items-center gap-2 rounded-xl bg-primary-soft px-4 py-3 text-sm font-medium text-primary">
                <Wallet className="h-4 w-4" />
                Wallet: {formatNaira(user.balance)}
              </div>
            )}

            <button
              onClick={() => {
                navigate("/dashboard");
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 rounded-xl border border-border px-4 py-3 hover:bg-muted transition"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>

            <button
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 rounded-xl border border-border px-4 py-3 hover:bg-muted transition"
            >
              <User className="h-4 w-4" />
              My Profile
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
