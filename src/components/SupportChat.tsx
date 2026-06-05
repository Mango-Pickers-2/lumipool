import { MessageCircleMore, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleChatwootReady = () => {
      if (window.$chatwoot) {
        window.$chatwoot.toggle("close");
      }
    };

    window.addEventListener("chatwoot:ready", handleChatwootReady);

    return () => {
      window.removeEventListener("chatwoot:ready", handleChatwootReady);
    };
  }, []);

  const toggleChat = () => {
    if (!window.$chatwoot) return;

    const nextState = !isOpen;

    window.$chatwoot.toggle(nextState ? "open" : "close");

    setIsOpen(nextState);
  };

  return (
    <div
      className="fixed z-[9999]"
      style={{
        bottom: "max(1rem, env(safe-area-inset-bottom))",
        right: "max(1rem, env(safe-area-inset-right))",
      }}
    >
      {/* Pulse Ring */}
      <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />

      {/* Chat Button */}
      <button
        onClick={toggleChat}
        aria-label="Open Support Chat"
        className="
          relative
          h-14 w-14 
          sm:h-16 sm:w-16
          rounded-full
          bg-primary
          text-primary-foreground
          shadow-2xl
          border border-primary/20
          flex items-center justify-center
          transition-all duration-300
          hover:scale-105
          active:scale-95
        "
      >
        {isOpen ? (
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        ) : (
          <MessageCircleMore className="h-6 w-6 sm:h-7 sm:w-7" />
        )}
      </button>

      {/* Floating Label */}
      <div
        className="
          absolute right-20 bottom-3
          whitespace-nowrap
          rounded-full
          bg-card
          border border-border
          shadow-lg
          px-4 py-2
          text-sm font-medium
          text-foreground
          hidden md:flex
          items-center gap-2
        "
      >
        <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
        Support Online
      </div>
    </div>
  );
}
