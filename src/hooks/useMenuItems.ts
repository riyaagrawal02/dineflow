import { useQuery } from "@tanstack/react-query";
import menuPlaceholder from "@/assets/hero-food.jpg";
import { menuItems as mockMenuItems } from "@/data/mockData";
import { apiGet } from "@/lib/api";

export interface DbMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  is_veg: boolean;
  is_popular: boolean;
  is_available: boolean;
}

export const resolveMenuImageUrl = (image: string | null | undefined) => {
  if (!image) return menuPlaceholder;
  if (/^https?:\/\//i.test(image)) return image;
  return image;
};

export const useMenuItems = () => {
  return useQuery({
    queryKey: ["menu-items"],
    queryFn: async () => {
      if (import.meta.env.VITE_USE_MOCK_DATA === "true") {
        const mockItems = mockMenuItems.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          image: resolveMenuImageUrl(item.image),
          is_veg: item.isVeg,
          is_popular: item.isPopular,
          is_available: true,
        }));
        return mockItems as DbMenuItem[];
      }
      const { items } = await apiGet<{ items: DbMenuItem[] }>("/menu?available=true");
      const mapped = (items || []).map((item) => ({
        ...item,
        image: resolveMenuImageUrl(item.image),
      }));
      return mapped as DbMenuItem[];
    },
  });
};

export const useCategories = (items: DbMenuItem[] | undefined) => {
  if (!items) return ["All"];
  const cats = [...new Set(items.map((i) => i.category))];
  return ["All", ...cats];
};

// Convert DB item to the shape used by CartContext
export const toMenuItem = (item: DbMenuItem) => ({
  id: item.id,
  name: item.name,
  description: item.description,
  price: item.price,
  category: item.category,
  image: item.image,
  isVeg: item.is_veg,
  isPopular: item.is_popular,
});
