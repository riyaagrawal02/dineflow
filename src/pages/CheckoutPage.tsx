import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, ShoppingBag, CreditCard, ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { id: 1, label: "Details", icon: User },
  { id: 2, label: "Review", icon: ShoppingBag },
  { id: 3, label: "Payment", icon: CreditCard },
];

const CheckoutPage = () => {
  const { items, subtotal, tax, total, tableNumber, clearCart } = useCart();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [table, setTable] = useState(tableNumber?.toString() || "");
  const [processing, setProcessing] = useState(false);

  const createOrder = async () => {
    const payload = {
      customerName: name.trim(),
      phone: phone.trim(),
      tableNumber: parseInt(table),
      totalAmount: total,
      paymentStatus: "paid",
      orderStatus: "placed",
      items: items.map((item) => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
        price: item.menuItem.price,
      })),
    };
    const { orderNumber } = await apiPost<{ orderNumber: string }>("/orders", payload);
    return orderNumber;
  };

  const handlePayment = async () => {
    if (!name.trim() || !phone.trim() || !table.trim()) {
      toast.error("Please fill all fields");
      setCurrentStep(1);
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setProcessing(true);

    try {
      const data = await apiPost<{ order_id: string; amount: number; currency: string; key_id: string }>(
        "/payments/razorpay-order",
        {
          amount: total,
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
          notes: { customer_name: name.trim(), table_number: table },
        }
      );

      if (!data?.order_id) {
        throw new Error("Failed to create payment order");
      }

      const options: RazorpayOptions = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "MyRestaurant",
        description: `Order for Table ${table}`,
        order_id: data.order_id,
        prefill: {
          name: name.trim(),
          contact: phone.trim(),
        },
        theme: { color: "#C0392B" },
        handler: async (_response: RazorpayResponse) => {
          try {
            const orderNumber = await createOrder();
            clearCart();
            toast.success("Payment successful! Order placed.");
            navigate(`/order-confirmation/${orderNumber}`);
          } catch (err: any) {
            toast.error(err.message || "Order creation failed after payment");
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate payment");
      setProcessing(false);
    }
  };

  const canProceed = currentStep === 1 ? name.trim() && phone.trim() && table.trim() : true;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">Checkout</span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-foreground">Complete Your Order</h1>
        </div>

        {/* Progress Steps */}
        <div className="mt-8 flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${currentStep >= step.id
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-muted text-muted-foreground"
                    }`}
                >
                  <step.icon className="h-4 w-4" />
                </div>
                <span className={`mt-2 text-xs font-medium ${currentStep >= step.id ? "text-primary" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`mx-2 h-0.5 flex-1 rounded-full transition-colors duration-300 ${currentStep > step.id ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <h3 className="font-heading text-lg font-semibold text-card-foreground">Your Details</h3>
                  <div className="mt-5 space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="mt-1.5 rounded-xl" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="mt-1.5 rounded-xl" />
                    </div>
                    <div>
                      <Label htmlFor="table">Table Number</Label>
                      <Input id="table" value={table} onChange={(e) => setTable(e.target.value)} placeholder="e.g. 3" className="mt-1.5 rounded-xl" />
                    </div>
                  </div>
                </div>
                <Button onClick={() => setCurrentStep(2)} disabled={!canProceed} className="w-full rounded-full" size="lg">
                  Continue <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <h3 className="font-heading text-lg font-semibold text-card-foreground">Order Summary</h3>
                  <div className="mt-5 space-y-3">
                    {items.map((item) => (
                      <div key={item.menuItem.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <img src={item.menuItem.image} alt={item.menuItem.name} className="h-10 w-10 rounded-lg object-cover" />
                          <div>
                            <span className="text-sm font-medium text-card-foreground">{item.menuItem.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">× {item.quantity}</span>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-foreground">₹{item.menuItem.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-4 mt-4 space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>₹{subtotal}</span></div>
                      <div className="flex justify-between text-sm text-muted-foreground"><span>GST (5%)</span><span>₹{tax}</span></div>
                      <div className="flex justify-between font-heading text-xl font-bold text-foreground pt-2">
                        <span>Total</span><span className="text-primary">₹{total}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1 rounded-full" size="lg">
                    <ArrowLeft className="mr-2 h-5 w-5" /> Back
                  </Button>
                  <Button onClick={() => setCurrentStep(3)} className="flex-1 rounded-full" size="lg">
                    Continue <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-card text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <CreditCard className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-card-foreground">Secure Payment</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You'll be redirected to Razorpay to complete your payment of <span className="font-bold text-primary">₹{total}</span>
                  </p>
                  <div className="mt-6 flex justify-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">💳 UPI</span>
                    <span className="flex items-center gap-1">🏦 Cards</span>
                    <span className="flex items-center gap-1">👛 Wallets</span>
                    <span className="flex items-center gap-1">🏧 Net Banking</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1 rounded-full" size="lg">
                    <ArrowLeft className="mr-2 h-5 w-5" /> Back
                  </Button>
                  <Button onClick={handlePayment} disabled={processing} className="flex-1 rounded-full shadow-glow" size="lg">
                    {processing ? "Processing..." : `Pay ₹${total}`}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
