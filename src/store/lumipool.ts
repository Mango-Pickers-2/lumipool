import { create } from "zustand";

export type Role = "buyer" | "supplier" | "installer";

export interface CurrentUser {
  role: Role;
  name: string;
  balance: number;
}

export interface ActivePool {
  id: string;
  cluster: string;
  members: number;
  target: number;
  status: "open" | "filled";
  bundle: string;
  pricePerMember: number;
  deposit: number;
}

export interface NetworkNode {
  id: string;
  name: string;
  type: "supplier" | "installer";
  location: string;
  capacityLoad: number;
}

export interface PurchaseOrder {
  id: string;
  description: string;
  status: "safe-hold-confirmed" | "picked-up" | "delivered";
  createdAt: number;
}

export interface DispatchJob {
  id: string;
  cluster: string;
  location: string;
  units: number;
  status: "queued" | "in-progress" | "complete";
  createdAt: number;
}

interface LumiState {
  currentUser: CurrentUser | null;
  activePool: ActivePool;
  networkState: NetworkNode[];
  purchaseOrders: PurchaseOrder[];
  dispatchJobs: DispatchJob[];
  trackerStage: 0 | 1 | 2 | 3 | 4;
  login: (role: Role) => void;
  logout: () => void;
  setUser: (user: CurrentUser) => void;
  joinPool: () => void;
  confirmInventory: (orderId: string) => void;
  completeJob: (jobId: string) => void;
  topUp: (amount: number) => void;
}

const initialPool: ActivePool = {
  id: "Yaba-01",
  cluster: "Yaba Pool Cluster",
  members: 4,
  target: 5,
  status: "open",
  bundle: "5kVA Solar Micro-Bundle",
  pricePerMember: 850000,
  deposit: 85000,
};

const initialNetwork: NetworkNode[] = [
  { id: "s1", name: "SolarTech Lagos", type: "supplier", location: "Ikeja", capacityLoad: 42 },
  { id: "s2", name: "Lumen Depot", type: "supplier", location: "Lekki", capacityLoad: 68 },
  { id: "s3", name: "PowerGrid NG", type: "supplier", location: "Yaba", capacityLoad: 31 },
  { id: "i1", name: "Chinedu O.", type: "installer", location: "Yaba", capacityLoad: 55 },
  { id: "i2", name: "Tunde A.", type: "installer", location: "Surulere", capacityLoad: 22 },
  { id: "i3", name: "Femi K.", type: "installer", location: "Ikeja", capacityLoad: 77 },
];

export const useLumiStore = create<LumiState>((set, get) => ({
  currentUser: null,
  activePool: initialPool,
  networkState: initialNetwork,
  purchaseOrders: [],
  dispatchJobs: [],
  trackerStage: 0,

  login: (role) =>
    set({
      currentUser: {
        role,
        name: role === "buyer" ? "Daniel" : role === "supplier" ? "SolarTech Lagos" : "Chinedu O.",
        balance: role === "buyer" ? 100000 : role === "supplier" ? 4800000 : 320000,
      },
    }),

  setUser: (user) => set({ currentUser: user }),

  logout: () =>
    set({
      currentUser: null,
      activePool: initialPool,
      purchaseOrders: [],
      dispatchJobs: [],
      trackerStage: 0,
    }),

  joinPool: () => {
    const { activePool } = get();
    if (activePool.status === "filled") return;
    const members = Math.min(activePool.target, activePool.members + 1);
    const filled = members >= activePool.target;

    if (filled) {
      const orderId = `PO-${Date.now().toString().slice(-5)}`;
      const jobId = `DJ-${Date.now().toString().slice(-5)}`;
      set({
        activePool: { ...activePool, members, status: "filled" },
        trackerStage: 2,
        purchaseOrders: [
          {
            id: orderId,
            description: `5x ${activePool.bundle} | Safe-Hold Confirmed`,
            status: "safe-hold-confirmed",
            createdAt: Date.now(),
          },
        ],
        dispatchJobs: [
          {
            id: jobId,
            cluster: activePool.cluster,
            location: "Yaba, Lagos",
            units: 5,
            status: "queued",
            createdAt: Date.now(),
          },
        ],
      });
    } else {
      set({ activePool: { ...activePool, members } });
    }
  },

  confirmInventory: (orderId) =>
    set((s) => ({
      purchaseOrders: s.purchaseOrders.map((o) =>
        o.id === orderId ? { ...o, status: "picked-up" } : o,
      ),
      trackerStage: 3,
    })),

  completeJob: (jobId) =>
    set((s) => ({
      dispatchJobs: s.dispatchJobs.map((j) => (j.id === jobId ? { ...j, status: "complete" } : j)),
      trackerStage: 4,
    })),

  topUp: (amount) =>
    set((s) =>
      s.currentUser
        ? { currentUser: { ...s.currentUser, balance: s.currentUser.balance + amount } }
        : s,
    ),
}));

export const formatNaira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
