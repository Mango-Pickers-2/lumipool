import { useEffect } from "react";
import { loadChatwoot } from "@/lib/chatwoot";

export default function SupportChat() {
  useEffect(() => {
    loadChatwoot();
  }, []);

  return null;
}