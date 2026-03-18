import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface OrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  table_number: number;
  total_amount: number;
  order_status: string;
  payment_status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  placed: "bg-secondary/20 text-secondary-foreground border border-secondary/30",
  preparing: "bg-primary/10 text-primary border border-primary/20",
  ready: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
  served: "bg-green-500/10 text-green-600 border border-green-500/20",
};

const nextStatus: Record<string, string | null> = {
  placed: "preparing",
  preparing: "ready",
  ready: "served",
  served: null,
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);

  const fetchOrders = async () => {
    const { orders } = await apiGet<{ orders: OrderRow[] }>("/admin/orders");
    setOrders(orders || []);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiPatch(`/admin/orders/${id}`, { status });
      toast.success(`Order marked ${status}`);
      fetchOrders();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">No orders yet.</p>
        </div>
      )}
      {orders.map((order, i) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-heading text-base font-semibold text-card-foreground">{order.order_number}</p>
              <p className="text-sm text-muted-foreground">
                {order.customer_name} · Table {order.table_number}
              </p>
              <p className="text-xs text-muted-foreground/60 mt-0.5">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColors[order.order_status] || ""}`}>
                {order.order_status}
              </span>
              <span className="font-heading text-lg font-bold text-primary">₹{order.total_amount}</span>
              {nextStatus[order.order_status] && (
                <button
                  onClick={() => updateStatus(order.id, nextStatus[order.order_status]!)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:scale-105 active:scale-95"
                >
                  Mark {nextStatus[order.order_status]} <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminOrders;
