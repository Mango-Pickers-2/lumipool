import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

import BuyerProfile from "./pages/profile/BuyerProfile";
import SupplierProfile from "./pages/profile/SupplierProfile";
import InstallerProfile from "./pages/profile/InstallerProfile";

import { loadChatwoot } from "@/lib/chatwoot";
import SupportChat from "@/components/SupportChat";

export default function App() {
  useEffect(() => {
    loadChatwoot();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/profile/buyer" element={<BuyerProfile />} />
        <Route path="/profile/supplier" element={<SupplierProfile />} />
        <Route path="/profile/installer" element={<InstallerProfile />} />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>

      <SupportChat />
    </>
  );
}
