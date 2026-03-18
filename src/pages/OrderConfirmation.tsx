import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { CheckCircle, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface OrderData {
  order_number: string;
  table_number: number;
  order_status: string;
  total_amount: number;
}

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    apiGet<{ order: OrderData }>(`/orders/by-number/${orderId}`)
      .then((data) => {
        setOrder(data.order || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="skeleton h-8 w-32 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-32 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground">Order not found</h2>
          <Button asChild className="mt-4 rounded-full"><Link to="/">Go Home</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto flex flex-col items-center px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="relative"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute -right-2 -top-2"
          >
            <PartyPopper className="h-8 w-8 text-secondary" />
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="mt-8 font-heading text-3xl font-bold text-foreground">Order Confirmed!</h1>
          <p className="mt-2 text-muted-foreground">Your delicious meal is being prepared.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 w-full max-w-md rounded-2xl border border-border bg-card p-7 shadow-card text-left"
        >
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-semibold text-foreground">{order.order_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Table</span>
              <span className="font-semibold text-foreground">{order.table_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="rounded-full bg-secondary/20 px-3 py-0.5 text-xs font-semibold text-secondary-foreground capitalize">{order.order_status}</span>
            </div>
            <div className="border-t border-border pt-4 flex justify-between font-heading text-lg font-bold text-foreground">
              <span>Total Paid</span>
              <span className="text-primary">₹{order.total_amount}</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8 flex gap-4">
          <Button asChild className="rounded-full px-6 shadow-glow"><Link to="/track-order">Track Order</Link></Button>
          <Button asChild variant="outline" className="rounded-full px-6"><Link to="/menu">Order More</Link></Button>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
