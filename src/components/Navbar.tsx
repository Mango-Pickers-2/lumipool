import { Link, useNavigate } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { useLumiStore, formatNaira } from "@/store/lumipool";
import { Logo } from "./Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const user = useLumiStore((s) => s.currentUser);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-8">
        <Link to="/dashboard"><Logo /></Link>
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-primary-soft px-4 py-1.5 text-sm font-medium text-primary">
              <Wallet className="h-4 w-4" />
              Wallet: {formatNaira(user.balance)}
            </div>
            <button
              onClick={() => navigate({ to: "/profile" })}
              className="flex items-center gap-2 rounded-full hover:bg-muted px-2 py-1"
            >
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold leading-tight">{user.name}</div>
                <div className="text-xs text-muted-foreground capitalize leading-tight">{user.role} Account</div>
              </div>
              <Avatar className="h-9 w-9 border-2 border-border">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
