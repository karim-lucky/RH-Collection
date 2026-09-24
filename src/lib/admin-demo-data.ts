import type {
  Banner,
  Coupon,
  DashboardStats,
  Order,
  OrderStatus,
  Product,
  Review,
  UserProfile,
} from "@/types";
import { demoBanners, demoProducts, demoReviews } from "./demo-data";

export const demoOrders: Order[] = [
  
  {
    _id: "o2",
    orderNumber: "RW-M2DEF-AB34",
    userId: "u2",
    items: [
      {
        productId: "2",
        name: "Elegance Diamond",
        image: demoProducts[1].images[0],
        price: 125000,
        quantity: 1,
        color: "Rose Gold",
      },
    ],
    customer: { name: "Sarah Malik", email: "sarah@example.com", phone: "+92 321 9876543" },
    shippingAddress: {
      country: "Pakistan",
      province: "Sindh",
      city: "Karachi",
      address: "45 Clifton Block 5",
      postalCode: "75600",
    },
    deliveryMethod: "standard",
    paymentMethod: "cod",
    status: "shipped",
    subtotal: 125000,
    shipping: 500,
    tax: 6250,
    discount: 5000,
    total: 126750,
    couponCode: "LUXURY10",
    trackingNumber: "TRK-982341",
    createdAt: "2026-06-01T08:30:00.000Z",
    updatedAt: "2026-06-08T11:00:00.000Z",
  },
  {
    _id: "o3",
    orderNumber: "RW-M3GHI-CD56",
    userId: "u3",
    items: [
      {
        productId: "3",
        name: "Deep Sea Diver Pro",
        image: demoProducts[2].images[0],
        price: 59900,
        quantity: 2,
        color: "Black",
      },
    ],
    customer: { name: "Fatima Ali", email: "fatima@example.com", phone: "+92 333 5551234" },
    shippingAddress: {
      country: "Pakistan",
      province: "Islamabad",
      city: "Islamabad",
      address: "78 F-7 Markaz",
      postalCode: "44000",
    },
    deliveryMethod: "standard",
    paymentMethod: "easypaisa",
    status: "processing",
    subtotal: 119800,
    shipping: 500,
    tax: 5990,
    discount: 0,
    total: 126290,
    createdAt: "2026-06-10T16:00:00.000Z",
    updatedAt: "2026-06-11T09:00:00.000Z",
  },
  {
    _id: "o4",
    orderNumber: "RW-M4JKL-EF78",
    userId: "u4",
    items: [
      {
        productId: "6",
        name: "Midnight Black Edition",
        image: demoProducts[5].images[0],
        price: 185000,
        quantity: 1,
        color: "Black",
      },
    ],
    customer: { name: "Hassan Raza", email: "hassan@example.com", phone: "+92 345 7778899" },
    shippingAddress: {
      country: "Pakistan",
      province: "Punjab",
      city: "Rawalpindi",
      address: "12 Saddar Bazaar",
      postalCode: "46000",
    },
    deliveryMethod: "express",
    paymentMethod: "cod",
    status: "pending",
    subtotal: 185000,
    shipping: 1500,
    tax: 9250,
    discount: 0,
    total: 195750,
    createdAt: "2026-06-14T12:00:00.000Z",
    updatedAt: "2026-06-14T12:00:00.000Z",
  },
  {
    _id: "o5",
    orderNumber: "RW-M5MNO-GH90",
    userId: "u5",
    items: [
      {
        productId: "4",
        name: "Classic Dress Heritage",
        image: demoProducts[3].images[0],
        price: 45000,
        quantity: 1,
        color: "Brown",
      },
    ],
    customer: { name: "Ali Hassan", email: "ali@example.com", phone: "+92 312 4445566" },
    shippingAddress: {
      country: "Pakistan",
      province: "KPK",
      city: "Peshawar",
      address: "34 University Road",
      postalCode: "25000",
    },
    deliveryMethod: "standard",
    paymentMethod: "cod",
    status: "cancelled",
    subtotal: 45000,
    shipping: 500,
    tax: 2250,
    discount: 0,
    total: 47750,
    createdAt: "2026-05-20T09:00:00.000Z",
    updatedAt: "2026-05-21T10:00:00.000Z",
  },
];

export interface DemoCustomer extends UserProfile {
  createdAt: string;
}

export const demoCustomers: DemoCustomer[] = [
  {
    _id: "u1",
    name: "Ahmed Khan",
    email: "ahmed@example.com",
    phone: "+03365884894",
    role: "user",
    addresses: [],
    wishlist: ["1", "3"],
    createdAt: "2026-01-15T00:00:00.000Z",
  },
  {
    _id: "u2",
    name: "Sarah Malik",
    email: "sarah@example.com",
    phone: "+92 321 9876543",
    role: "user",
    addresses: [],
    wishlist: ["2"],
    createdAt: "2026-02-20T00:00:00.000Z",
  },
  {
    _id: "u3",
    name: "Fatima Ali",
    email: "fatima@example.com",
    phone: "+92 333 5551234",
    role: "user",
    addresses: [],
    wishlist: [],
    createdAt: "2026-03-10T00:00:00.000Z",
  },
  {
    _id: "u4",
    name: "Hassan Raza",
    email: "hassan@example.com",
    phone: "+92 345 7778899",
    role: "user",
    addresses: [],
    wishlist: ["6", "8"],
    createdAt: "2026-04-05T00:00:00.000Z",
  },
  {
    _id: "admin1",
    name: "Admin User",
    email: "admin@rehmatwatches.com",
    role: "admin",
    addresses: [],
    wishlist: [],
    createdAt: "2025-12-01T00:00:00.000Z",
  },
];

export const demoCoupons: Coupon[] = [
  {
    _id: "c1",
    code: "LUXURY10",
    discountPercent: 10,
    expiryDate: "2026-12-31T00:00:00.000Z",
    active: true,
    usageCount: 24,
    maxUsage: 100,
  },
  {
    _id: "c2",
    code: "WELCOME15",
    discountPercent: 15,
    expiryDate: "2026-09-30T00:00:00.000Z",
    active: true,
    usageCount: 56,
    maxUsage: 200,
  },
  {
    _id: "c3",
    code: "VIP20",
    discountPercent: 20,
    expiryDate: "2026-06-30T00:00:00.000Z",
    active: false,
    usageCount: 12,
    maxUsage: 50,
  },
];

export const demoPendingReviews: Review[] = [
  ...demoReviews,
  {
    _id: "r4",
    productId: "5",
    userId: "u4",
    userName: "Hassan Raza",
    rating: 4,
    comment: "Great sport watch, comfortable on the wrist. Delivery was fast too.",
    approved: false,
    createdAt: "2026-06-12T00:00:00.000Z",
  },
  {
    _id: "r5",
    productId: "8",
    userId: "u1",
    userName: "Ahmed Khan",
    rating: 5,
    comment: "The GMT function is perfect for my travels. Highly recommend this piece.",
    approved: false,
    createdAt: "2026-06-13T00:00:00.000Z",
  },
];

let mutableProducts = [...demoProducts];
let mutableOrders = [...demoOrders];
let mutableCoupons = [...demoCoupons];
let mutableBanners: Banner[] = [...demoBanners];
let mutableReviews = [...demoPendingReviews];

export function getDemoProducts(): Product[] {
  return mutableProducts;
}

export function setDemoProducts(products: Product[]) {
  mutableProducts = products;
}

export function getDemoOrders(): Order[] {
  return mutableOrders;
}

export function setDemoOrders(orders: Order[]) {
  mutableOrders = orders;
}

export function getDemoCoupons(): Coupon[] {
  return mutableCoupons;
}

export function setDemoCoupons(coupons: Coupon[]) {
  mutableCoupons = coupons;
}

export function getDemoBanners(): Banner[] {
  return mutableBanners;
}

export function setDemoBanners(banners: Banner[]) {
  mutableBanners = banners;
}

export function getDemoReviews(): Review[] {
  return mutableReviews;
}

export function setDemoReviews(reviews: Review[]) {
  mutableReviews = reviews;
}

export function getDemoStats(): DashboardStats {
  const deliveredOrders = mutableOrders.filter((o) => o.status === "delivered");
  const totalSales = mutableOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const statusCounts: Record<OrderStatus, number> = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };
  mutableOrders.forEach((o) => {
    statusCounts[o.status]++;
  });

  return {
    totalSales,
    totalOrders: mutableOrders.length,
    totalCustomers: demoCustomers.filter((c) => c.role === "user").length,
    totalProducts: mutableProducts.length,
    monthlyRevenue: [
      { month: "Jan", revenue: 245000 },
      { month: "Feb", revenue: 312000 },
      { month: "Mar", revenue: 287500 },
      { month: "Apr", revenue: 356000 },
      { month: "May", revenue: deliveredOrders.length > 0 ? 420000 : 398000 },
      { month: "Jun", revenue: 185000 + 126290 },
    ],
    ordersByStatus: Object.entries(statusCounts)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => ({ status, count })),
  };
}
