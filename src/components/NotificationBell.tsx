import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Role } from "@/store/lumipool";

interface AppNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
}

export function NotificationBell({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);

  useEffect(() => {
    const notificationsQuery = query(collection(db, "notifications"), where("recipientRole", "==", role));
    return onSnapshot(notificationsQuery, (snapshot) => {
      setItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as AppNotification).sort((a, b) => b.createdAt - a.createdAt).slice(0, 20));
    }, (error) => console.error("Notification subscription failed:", error));
  }, [role]);

  const unread = useMemo(() => items.filter((item) => !item.read).length, [items]);

  const markAllRead = async () => {
    await Promise.all(items.filter((item) => !item.read).map((item) => updateDoc(doc(db, "notifications", item.id), { read: true })));
  };

  return (
    <div className="relative">
      <button type="button" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`} onClick={() => setOpen(!open)} className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted">
        <Bell className="h-5 w-5" />
        {unread > 0 && <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">{unread > 9 ? "9+" : unread}</span>}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="font-bold">Notifications</div>
            {unread > 0 && <button onClick={markAllRead} className="flex items-center gap-1 text-xs font-medium text-primary"><CheckCheck className="h-4 w-4" />Mark read</button>}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? <p className="p-6 text-center text-sm text-muted-foreground">No workflow notifications yet.</p> : items.map((item) => (
              <button key={item.id} onClick={() => !item.read && updateDoc(doc(db, "notifications", item.id), { read: true })} className={`w-full border-b border-border p-4 text-left last:border-0 ${item.read ? "bg-card" : "bg-primary/5"}`}>
                <div className="text-sm font-semibold">{item.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{item.message}</div>
                <div className="mt-2 text-[11px] text-muted-foreground">{new Date(item.createdAt).toLocaleString("en-NG")}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
