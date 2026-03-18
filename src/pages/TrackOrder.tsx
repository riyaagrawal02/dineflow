import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Package, ChefHat, Bell, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const statusSteps = [
  { key: "placed", label: "Order Placed", icon: Package },
  { key: "preparing", label: "Preparing", icon: ChefHat },
  { key: "ready", label: "Ready", icon: Bell },
  { key: "served", label: "Served", icon: CheckCircle2 },
] as const;

interface OrderRow {
  id: string;
  order_number: string;
  table_number: number;
  total_amount: number;
  order_status: string;
}

const TrackOrder = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    apiGet<{ orders: OrderRow[] }>("/orders/me?status=active")
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const getStepIndex = (status: string) => statusSteps.findIndex((s) => s.key === status);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">Live Status</span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-foreground">
            Track Orders
          </h1>
        </div>

        {loading ? (
          <div className="mt-10 space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="skeleton h-40 w-full rounded-2xl" />
            ))}
          </div>
        ) : !user ? (
          <div className="py-24 text-center">
            <p className="text-lg text-muted-foreground">Please sign in to track your orders.</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-24 text-center">
            <Package className="mx-auto h-16 w-16 text-muted-foreground/30" />
            <p className="mt-4 text-lg text-muted-foreground">No active orders to track.</p>
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            {orders.map((order, idx) => {
              const currentStep = getStepIndex(order.order_status);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-6 shadow-card"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-heading text-lg font-semibold text-card-foreground">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">Table {order.table_number}</p>
                    </div>
                    <span className="font-heading text-xl font-bold text-primary">₹{order.total_amount}</span>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    {statusSteps.map((step, i) => {
                      const isActive = i <= currentStep;
                      const isCurrent = i === currentStep;
                      return (
                        <div key={step.key} className="flex flex-1 flex-col items-center">
                          <div className="relative flex items-center w-full">
                            {i > 0 && (
                              <div className={`h-0.5 flex-1 rounded-full transition-colors duration-500 ${i <= currentStep ? "bg-primary" : "bg-border"}`} />
                            )}
                            <motion.div
                              animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className={`z-10 flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 ${isActive
                                  ? "bg-primary text-primary-foreground shadow-glow"
                                  : "bg-muted text-muted-foreground"
                                }`}
                            >
                              <step.icon className="h-5 w-5" />
                            </motion.div>
                            {i < statusSteps.length - 1 && (
                              <div className={`h-0.5 flex-1 rounded-full transition-colors duration-500 ${i < currentStep ? "bg-primary" : "bg-border"}`} />
                            )}
                          </div>
                          <span className={`mt-2 text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TrackOrder;
