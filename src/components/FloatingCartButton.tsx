import { Link, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const hiddenRoutes = ["/cart", "/checkout", "/admin"];

const FloatingCartButton = () => {
  const { totalItems, total } = useCart();
  const location = useLocation();

  const hidden = hiddenRoutes.some((r) => location.pathname.startsWith(r));

  return (
    <AnimatePresence>
      {totalItems > 0 && !hidden && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
        >
          <Link
            to="/cart"
            className="flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-primary-foreground shadow-glow transition-transform duration-200 hover:scale-105"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="text-sm font-semibold">{totalItems} item{totalItems > 1 ? "s" : ""}</span>
            <span className="h-5 w-px bg-primary-foreground/30" />
            <span className="text-sm font-bold">₹{total}</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCartButton;
