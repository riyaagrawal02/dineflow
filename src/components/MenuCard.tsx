import { useCart } from "@/context/CartContext";
import { Plus, Minus, Leaf, Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { resolveMenuImageUrl, type DbMenuItem, toMenuItem } from "@/hooks/useMenuItems";
import menuPlaceholder from "@/assets/hero-food.jpg";
import { useAuth } from "@/context/AuthContext";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";

interface MenuCardProps {
  item: DbMenuItem;
}

const MenuCard = ({ item }: MenuCardProps) => {
  const { items, addItem, updateQuantity } = useCart();
  const { user } = useAuth();
  const cartItem = items.find((i) => i.menuItem.id === item.id);
  const menuItem = toMenuItem(item);
  const imageUrl = resolveMenuImageUrl(item.image);

  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Please sign in to save favorites");
      return;
    }
    const { status } = await apiPost<{ status: "added" | "removed" }>("/favorites/toggle", {
      menuItemId: item.id,
    });
    toast.success(status === "added" ? "Added to favorites" : "Removed from favorites");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-elevated"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            if (e.currentTarget.dataset.fallback === "true") return;
            e.currentTarget.dataset.fallback = "true";
            e.currentTarget.src = menuPlaceholder;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex gap-2">
          {item.is_veg ? (
            <span className="flex items-center gap-1 rounded-full bg-green-500/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
              <Leaf className="h-3 w-3" /> Veg
            </span>
          ) : (
            <span className="rounded-full bg-red-500/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">Non-Veg</span>
          )}
        </div>
        <div className="absolute right-3 top-3 flex gap-2">
          {item.is_popular && (
            <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-secondary-foreground">
              <Star className="h-3 w-3 fill-current" /> Popular
            </span>
          )}
          {user && (
            <button
              onClick={toggleFavorite}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm transition-all duration-200 hover:bg-card hover:scale-110"
            >
              <Heart className="h-4 w-4 text-primary" />
            </button>
          )}
        </div>

        {/* Rating badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 backdrop-blur-sm">
          <Star className="h-3 w-3 fill-secondary text-secondary" />
          <span className="text-[11px] font-semibold text-card-foreground">4.5</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-heading text-lg font-semibold text-card-foreground leading-tight">{item.name}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-heading text-xl font-bold text-primary">₹{item.price}</span>

          {cartItem ? (
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 p-1">
              <button
                onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-150 hover:scale-110 active:scale-95"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-7 text-center font-body text-sm font-bold text-primary">{cartItem.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-150 hover:scale-110 active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Button
              onClick={() => addItem(menuItem)}
              size="sm"
              className="rounded-full px-5 transition-transform duration-150 hover:scale-105 active:scale-95"
            >
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;
