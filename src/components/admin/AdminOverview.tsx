import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { IndianRupee, ShoppingBag, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const AdminOverview = () => {
  const [stats, setStats] = useState({ total: 0, revenue: 0, pending: 0, completed: 0 });

  useEffect(() => {
    apiGet<{ total: number; revenue: number; pending: number; completed: number }>("/admin/overview")
      .then((data) => setStats({
        total: data.total,
        revenue: data.revenue,
        pending: data.pending,
        completed: data.completed,
      }))
      .catch(() => setStats({ total: 0, revenue: 0, pending: 0, completed: 0 }));
  }, []);

  const cards = [
    { label: "Total Orders", value: stats.total, icon: ShoppingBag, color: "bg-primary/10 text-primary", trend: "+12%" },
    { label: "Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: IndianRupee, color: "bg-green-500/10 text-green-600", trend: "+8%" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "bg-secondary/20 text-secondary-foreground", trend: "" },
    { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "bg-blue-500/10 text-blue-600", trend: "+15%" },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-elevated"
        >
          <div className="flex items-center justify-between">
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            {s.trend && (
              <span className="flex items-center gap-0.5 text-xs font-medium text-green-600">
                <TrendingUp className="h-3 w-3" /> {s.trend}
              </span>
            )}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{s.label}</p>
          <p className="mt-1 font-heading text-2xl font-bold text-card-foreground">{s.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminOverview;
