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

    window.addEventListener(
      "chatwoot:ready",
      handleChatwootReady
    );

    return () => {
      window.removeEventListener(
        "chatwoot:ready",
        handleChatwootReady
      );
    };
  }, []);

  const toggleChat = () => {
    if (!window.$chatwoot) return;

    if (isOpen) {
      window.$chatwoot.toggle("close");
      setIsOpen(false);
    } else {
      window.$chatwoot.toggle("open");
      setIsOpen(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Pulse Ring */}
      <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />

      {/* Chat Button */}
      <button
        onClick={toggleChat}
        aria-label="Open Support Chat"
        className="
          relative
          h-16 w-16
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
          <X className="h-6 w-6" />
        ) : (
          <MessageCircleMore className="h-7 w-7" />
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