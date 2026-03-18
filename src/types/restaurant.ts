export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  isPopular: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export type OrderStatus = "placed" | "preparing" | "ready" | "served";
export type PaymentStatus = "pending" | "paid" | "failed";

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  tableNumber: number;
  items: CartItem[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
}
