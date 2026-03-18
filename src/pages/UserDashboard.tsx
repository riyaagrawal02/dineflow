import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiDelete, apiGet } from "@/lib/api";
import { User, ShoppingBag, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { resolveMenuImageUrl } from "@/hooks/useMenuItems";
import menuPlaceholder from "@/assets/hero-food.jpg";

interface OrderRow {
  id: string;
  order_number: string;
  total_amount: number;
  order_status: string;
  createdAt: string;
  table_number: number;
}

interface FavoriteRow {
  id: string;
  menuItem: { id: string; name: string; price: number; image: string; is_veg: boolean } | null;
}

const UserDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);
  const [tab, setTab] = useState<"orders" | "favorites">("orders");

  useEffect(() => {
    if (!user) return;
    apiGet<{ orders: OrderRow[] }>("/orders/me")
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]));

    apiGet<{ favorites: FavoriteRow[] }>("/favorites")
      .then((data) => setFavorites(data.favorites || []))
      .catch(() => setFavorites([]));
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const removeFavorite = async (id: string) => {
    await apiDelete(`/favorites/${id}`);
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            My <span className="text-primary">Account</span>
          </h1>
          <Button variant="outline" onClick={handleSignOut} className="rounded-xl">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-heading font-semibold text-card-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-2">
          {[
            { id: "orders" as const, label: "Order History", icon: ShoppingBag },
            { id: "favorites" as const, label: "Favorites", icon: Heart },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${tab === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "orders" && (
            <div className="space-y-3">
              {orders.length === 0 && <p className="py-12 text-center text-muted-foreground">No orders yet.</p>}
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-card">
                  <div>
                    <p className="font-heading font-semibold text-card-foreground">{o.order_number}</p>
                    <p className="text-sm text-muted-foreground">
                      Table {o.table_number} · {new Date(o.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-bold text-primary">₹{o.total_amount}</span>
                    <p className="text-xs capitalize text-muted-foreground">{o.order_status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "favorites" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.length === 0 && <p className="col-span-full py-12 text-center text-muted-foreground">No favorites yet.</p>}
              {favorites.map((f) => (
                <div key={f.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                  {f.menuItem && (
                    <>
                      <img
                        src={resolveMenuImageUrl(f.menuItem.image)}
                        alt={f.menuItem.name}
                        className="h-32 w-full rounded-xl object-cover"
                        onError={(e) => {
                          if (e.currentTarget.dataset.fallback === "true") return;
                          e.currentTarget.dataset.fallback = "true";
                          e.currentTarget.src = menuPlaceholder;
                        }}
                      />
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <p className="font-heading font-semibold text-card-foreground">{f.menuItem.name}</p>
                          <p className="text-sm font-bold text-primary">₹{f.menuItem.price}</p>
                        </div>
                        <button onClick={() => removeFavorite(f.id)} className="text-sm text-destructive hover:underline">
                          Remove
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
