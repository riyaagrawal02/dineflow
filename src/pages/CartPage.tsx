import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CartPage = () => {
  const { items, updateQuantity, removeItem, subtotal, tax, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-32 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
          </div>
          <h2 className="mt-6 font-heading text-2xl font-bold text-foreground">Your cart is empty</h2>
          <p className="mt-2 text-muted-foreground">Discover our delicious menu and add your favorites!</p>
          <Button asChild className="mt-8 rounded-full px-8" size="lg">
            <Link to="/menu">Browse Menu <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">Review</span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-foreground">Your Cart</h1>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.menuItem.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-elevated"
                >
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="h-20 w-20 rounded-xl object-cover"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-base font-semibold text-card-foreground truncate">{item.menuItem.name}</h3>
                    <p className="text-sm font-semibold text-primary mt-0.5">₹{item.menuItem.price}</p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-muted p-1">
                    <button
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-card"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-card"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="w-20 text-right font-heading text-base font-bold text-foreground">
                    ₹{item.menuItem.price * item.quantity}
                  </p>
                  <button
                    onClick={() => removeItem(item.menuItem.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-destructive/50 transition-all hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="h-fit rounded-2xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-24">
            <h3 className="font-heading text-lg font-semibold text-card-foreground">Order Summary</h3>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>GST (5%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between font-heading text-xl font-bold text-foreground">
                <span>Total</span>
                <span className="text-primary">₹{total}</span>
              </div>
            </div>
            <Button asChild className="mt-6 w-full rounded-full shadow-glow" size="lg">
              <Link to="/checkout">
                Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
