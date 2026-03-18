import { useState } from "react";
import { Leaf, Trash2 } from "lucide-react";
import { resolveMenuImageUrl, useMenuItems, type DbMenuItem } from "@/hooks/useMenuItems";
import menuPlaceholder from "@/assets/hero-food.jpg";
import { apiDelete } from "@/lib/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import AdminMenuForm from "./AdminMenuForm";

const AdminMenu = () => {
  const { data: menuItems, isLoading } = useMenuItems();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<DbMenuItem | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      await apiDelete(`/menu/${id}`);
      toast.success("Item deleted");
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const handleSaved = () => queryClient.invalidateQueries({ queryKey: ["menu-items"] });

  if (isLoading) return <div className="py-12 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{menuItems?.length || 0} items</p>
        <button onClick={() => { setEditItem(null); setShowForm(true); }} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          + Add Item
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Item</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems?.map((item) => (

              <tr key={item.id} className="border-b border-border/50 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={resolveMenuImageUrl(item.image)}
                      alt={item.name}
                      className="h-10 w-10 rounded-lg object-cover"
                      onError={(e) => {
                        if (e.currentTarget.dataset.fallback === "true") return;
                        e.currentTarget.dataset.fallback = "true";
                        e.currentTarget.src = menuPlaceholder;
                      }}
                    />
                    <span className="font-medium text-card-foreground">{item.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                <td className="px-4 py-3 font-semibold text-primary">₹{item.price}</td>
                <td className="px-4 py-3">
                  {item.is_veg ? (
                    <span className="inline-flex items-center gap-1 text-green-600"><Leaf className="h-3 w-3" /> Veg</span>
                  ) : (
                    <span className="text-red-500">Non-Veg</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => { setEditItem(item); setShowForm(true); }} className="text-sm text-primary hover:underline">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-sm text-destructive hover:underline"><Trash2 className="inline h-3 w-3" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && <AdminMenuForm item={editItem} onClose={() => setShowForm(false)} onSaved={handleSaved} />}
    </div>
  );
};

export default AdminMenu;
