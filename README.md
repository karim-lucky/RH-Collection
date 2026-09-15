# Rehmat Watches — Luxury Watch E-commerce

A production-ready luxury watch e-commerce platform built with Next.js 15+, featuring a premium black & gold design, full admin dashboard, Stripe payments, and WhatsApp ordering.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI:** Shadcn UI + Radix UI
- **Database:** MongoDB + Mongoose
- **Auth:** NextAuth v5 (Credentials + Google)
- **Payments:** Stripe
- **Images:** Cloudinary
- **Animations:** Framer Motion

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

### 3. Seed the database (optional)

```bash
npm run seed
```

Default accounts:
- **Admin:** admin@rehmatwatches.com / admin123
- **User:** user@rehmatwatches.com / user123

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Note:** The site works without MongoDB using built-in demo product data.

## Features

### Storefront
- Full-screen hero slider with luxury banners
- Product catalog with filters, sorting, search & pagination
- Product detail with image zoom, specs, reviews
- Shopping cart & checkout (Stripe, COD, Bank Transfer)
- WhatsApp ordering integration
- Wishlist & recently viewed
- Customer dashboard (orders, profile, addresses)
- Dark mode toggle
- SEO optimized (sitemap, robots.txt, meta tags)

### Admin Dashboard (`/admin`)
- Revenue analytics & charts
- Product management (CRUD + Cloudinary upload)
- Order management with status updates
- Customer management
- Coupon management
- Banner/slider management
- Review moderation
- Inventory tracking with low-stock alerts

## Project Structure

```
src/
├── app/
│   ├── (shop)/          # Storefront pages
│   ├── (auth)/          # Login, register, forgot password
│   ├── admin/           # Admin dashboard
│   ├── dashboard/       # Customer dashboard
│   └── api/             # API routes
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── shop/            # Store components
│   ├── admin/           # Admin components
│   └── layout/          # Header, Footer, WhatsApp
├── contexts/            # Cart & Wishlist state
├── lib/                 # Utilities, auth, stripe, etc.
├── models/              # Mongoose schemas
└── types/               # TypeScript types
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `AUTH_SECRET` | NextAuth secret key |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth secret |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `CLOUDINARY_*` | Cloudinary credentials |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp business number |

## License

Private — Rehmat Watches
