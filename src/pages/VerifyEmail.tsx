import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiPost } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            setStatus("error");
            return;
        }

        const verify = async () => {
            setStatus("verifying");
            try {
                await apiPost<{ ok: boolean }>("/auth/verify-email", { token });
                setStatus("success");
            } catch (err: any) {
                setStatus("error");
                toast.error(err.message || "Verification failed");
            }
        };

        verify();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto flex max-w-md flex-col items-center px-4 py-20">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-glow">
                    <span className="font-heading text-2xl font-bold text-primary-foreground">M</span>
                </div>
                <h1 className="mt-6 font-heading text-3xl font-bold text-foreground">Verify Email</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    {status === "verifying" && "Verifying your email..."}
                    {status === "success" && "Your email is verified. You can sign in now."}
                    {status === "error" && "Verification link is invalid or expired."}
                    {status === "idle" && "Preparing verification..."}
                </p>

                <div className="mt-8 w-full rounded-2xl border border-border bg-card p-7 text-center shadow-card">
                    <Button asChild className="w-full rounded-full shadow-glow" size="lg">
                        <Link to="/login">Go to login</Link>
                    </Button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default VerifyEmail;
