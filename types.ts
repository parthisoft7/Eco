
export enum OrderStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  CANCELLED = 'Cancelled',
  DELIVERED = 'Delivered'
}

export interface Category {
  id: string;
  name: string;
  image: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  discount: number;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id?: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: OrderStatus;
  razorpayOrderId?: string;
  createdAt: number;
  customerDetails: {
    name: string;
    mobile: string;
    address: string;
    email: string;
  };
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockCount: number;
}
