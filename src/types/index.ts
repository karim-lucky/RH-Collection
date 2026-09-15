export type ProductCategory =
  | "dress"
  | "sport"
  | "diver"
  | "chronograph"
  | "smart"
  | "luxury";

export type Gender = "men" | "women" | "unisex";
export type StrapType = "leather" | "metal" | "rubber" | "nylon" | "ceramic";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
export type PaymentMethod = " easypaisa" | "cod" | "bank_transfer" | "stripe";
export type DeliveryMethod = "standard" | "express";

export interface ProductSpecs {
  movement?: string;
  caseSize?: string;
  caseMaterial?: string;
  waterResistance?: string;
  dialColor?: string;
  crystal?: string;
  warranty?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: ProductCategory;
  gender: Gender;
  strapType: StrapType;
  color: string;
  description: string;
  specifications: ProductSpecs;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  color: string;
}

export interface Address {
  _id?: string;
  label?: string;
  country: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: Address;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  couponCode?: string;
  stripePaymentId?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discountPercent: number;
  expiryDate: string;
  active: boolean;
  usageCount: number;
  maxUsage?: number;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  type: "hero" | "promo";
  active: boolean;
  order: number;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  addresses: Address[];
  wishlist: string[];
  image?: string;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  monthlyRevenue: { month: string; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
}
