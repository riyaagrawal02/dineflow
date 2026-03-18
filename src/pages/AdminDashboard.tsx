import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, UtensilsCrossed, ClipboardList, QrCode } from "lucide-react";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminMenu from "@/components/admin/AdminMenu";
import AdminQR from "@/components/admin/AdminQR";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ClipboardList },
  { id: "menu", label: "Menu", icon: UtensilsCrossed },
  { id: "qr", label: "QR Codes", icon: QrCode },
];

const AdminDashboard = () => {
  const { isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="skeleton h-8 w-32 rounded-xl" />
    </div>
  );
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">Management</span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {activeTab === "overview" && <AdminOverview />}
          {activeTab === "orders" && <AdminOrders />}
          {activeTab === "menu" && <AdminMenu />}
          {activeTab === "qr" && <AdminQR />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
