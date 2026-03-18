import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMenuItems, useCategories } from "@/hooks/useMenuItems";
import { useCart } from "@/context/CartContext";
import MenuCard from "@/components/MenuCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const MenuPage = () => {
  const [searchParams] = useSearchParams();
  const { setTableNumber } = useCart();
  const { data: menuItems, isLoading } = useMenuItems();
  const categories = useCategories(menuItems);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    const table = searchParams.get("table");
    if (table && !isNaN(Number(table))) {
      setTableNumber(Number(table));
    }
  }, [searchParams, setTableNumber]);

  const filtered = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesVeg = !vegOnly || item.is_veg;
      return matchesSearch && matchesCategory && matchesVeg;
    });
  }, [menuItems, search, activeCategory, vegOnly]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {searchParams.get("table") && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl bg-primary/10 px-5 py-3.5 text-sm font-medium text-primary border border-primary/20"
          >
            📍 Ordering for <span className="font-bold">Table {searchParams.get("table")}</span>
          </motion.div>
        )}

        <div className="flex items-end justify-between">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">Explore</span>
            <h1 className="mt-1 font-heading text-3xl font-bold text-foreground md:text-4xl">
              Our Menu
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">{filtered.length} dishes</p>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-full pl-10 pr-4 border-border bg-card shadow-card"
            />
          </div>
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
              vegOnly
                ? "border-green-500 bg-green-500/10 text-green-600 shadow-sm"
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            🌿 Veg Only
          </button>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="skeleton aspect-[4/3]" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <motion.div
              className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
              }}
            >
              {filtered.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </motion.div>
            {filtered.length === 0 && (
              <div className="py-24 text-center">
                <p className="text-lg text-muted-foreground">No dishes found.</p>
                <p className="mt-1 text-sm text-muted-foreground/70">Try a different search or category.</p>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MenuPage;
