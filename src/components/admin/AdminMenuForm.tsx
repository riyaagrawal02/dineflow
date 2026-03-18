import { useState } from "react";
import { apiPost, apiPut } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { type DbMenuItem } from "@/hooks/useMenuItems";

interface AdminMenuFormProps {
  item?: DbMenuItem | null;
  onClose: () => void;
  onSaved: () => void;
}

const AdminMenuForm = ({ item, onClose, onSaved }: AdminMenuFormProps) => {
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [price, setPrice] = useState(item?.price?.toString() || "");
  const [category, setCategory] = useState(item?.category || "");
  const [image, setImage] = useState(item?.image || "");
  const [isVeg, setIsVeg] = useState(item?.is_veg ?? true);
  const [isPopular, setIsPopular] = useState(item?.is_popular ?? false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price.trim() || !category.trim()) {
      toast.error("Name, price, and category are required");
      return;
    }

    setSaving(true);
    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: parseInt(price),
      category: category.trim(),
      image: image.trim(),
      is_veg: isVeg,
      is_popular: isPopular,
    };

    try {
      if (item) {
        await apiPut(`/menu/${item.id}`, payload);
        toast.success("Item updated!");
      } else {
        await apiPost("/menu", payload);
        toast.success("Item added!");
      }
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4 rounded-2xl border border-border bg-card p-6 shadow-elevated">
        <h3 className="font-heading text-xl font-bold text-card-foreground">{item ? "Edit" : "Add"} Menu Item</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 rounded-xl" /></div>
          <div><Label>Category</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Main Course" className="mt-1 rounded-xl" /></div>
          <div><Label>Price (₹)</Label><Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 rounded-xl" /></div>
          <div><Label>Image URL</Label><Input value={image} onChange={(e) => setImage(e.target.value)} className="mt-1 rounded-xl" /></div>
        </div>
        <div><Label>Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 rounded-xl" /></div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2"><Switch checked={isVeg} onCheckedChange={setIsVeg} /><Label>Vegetarian</Label></div>
          <div className="flex items-center gap-2"><Switch checked={isPopular} onCheckedChange={setIsPopular} /><Label>Popular</Label></div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving} className="flex-1 rounded-xl">{saving ? "Saving..." : "Save"}</Button>
          <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default AdminMenuForm;
