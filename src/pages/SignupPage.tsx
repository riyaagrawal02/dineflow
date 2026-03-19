import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SignupPage = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { status } = await signUp(email, password, name);
      if (status === "created") {
        toast.success("Account created! Check your email to confirm.");
        navigate("/login");
        return;
      }
      if (status === "resent") {
        toast.success("Verification email sent. Check your inbox.");
        navigate("/login");
        return;
      }
      toast.info("Account already exists. Please sign in.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto flex max-w-md flex-col items-center px-4 py-20">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-glow">
          <span className="font-heading text-2xl font-bold text-primary-foreground">M</span>
        </div>
        <h1 className="mt-6 font-heading text-3xl font-bold text-foreground">Create Account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Join MyRestaurant for a smarter dining experience</p>

        <form onSubmit={handleSubmit} className="mt-8 w-full space-y-5 rounded-2xl border border-border bg-card p-7 shadow-card">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
            <div className="relative mt-1.5">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="rounded-xl pl-10" />
            </div>
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="rounded-xl pl-10" />
            </div>
          </div>
          <div>
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" className="rounded-xl pl-10" />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full shadow-glow" size="lg">
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default SignupPage;
