# Coffeelo — Modern Specialty Coffee E-Commerce & Admin Platform

**Coffeelo** is a full-stack specialty coffee shop web application combining an editorial customer e-commerce storefront with an integrated, role-protected Admin Operations Dashboard. Built with React, Vite, TypeScript, Tailwind CSS, GSAP/Lenis, Express.js, Prisma ORM, and MySQL.

---

## Key Features

### Customer Storefront
- **Editorial Landing Experience:** Smooth-scroll storytelling with GSAP + Lenis (`prefers-reduced-motion` aware), specialty coffee showcase, tasting notes, and roastery location guide.
- **Interactive Menu & Customizer:** Search, category/roast/temperature filtering, sorting, and live variant price calculation.
- **Authenticated Ordering Flow:** Protected ordering requiring customer sign-in or registration, supporting **Express Pickup** (store selection) and **Courier Delivery** (full address snapshot).
- **QRIS Barcode & Cash Payment Modes:** Instant QRIS barcode generation & payment confirmation (`PAID` / `CONFIRMED`) alongside Cash / Pay-on-Site (`PENDING` until settled), plus Midtrans webhook signature verification & atomic inventory reservation.
- **Order Tracking & History:** Dedicated **Riwayat Pesanan** navigation with real-time order status timeline (`PENDING` -> `CONFIRMED` -> `PROCESSING` -> `READY` / `ON_DELIVERY` -> `COMPLETED`).

### Admin Portal (`/admin/*`)
- **Real-Time Business Analytics:** Total revenue, order volume, customer count, average order value, 7/14/30-day sales chart, top-selling products, and status breakdown.
- **Catalog & Inventory Management:** Full CRUD for products, variants, pricing, stock, availability toggles, and menu categories.
- **Order & Payment Operations:** Live order table, status workflow updates with optional manual payment settlement, payment logs, customer directory, review moderation, CSV sales reports, and store configuration.
- **Multi-Tab Session Isolation & Security:** Separate JWT storage keys for Admin and Customer sessions, RBAC (`Role.ADMIN`), Zod input validation (`body`, `query`, `params`), rate limiting, and security headers.

---

## Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, React Router DOM, Zustand, Axios, Lucide Icons
- **Motion:** GSAP, ScrollTrigger, Lenis Smooth Scroll
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MySQL, Prisma ORM (interactive transactions & optimistic stock guards)
- **Security & Validation:** JWT, bcryptjs, Zod, RBAC, Midtrans SHA-512 webhook verification

---

## Project Structure

```text
coffeelo/
├── frontend/               # React + Vite + TypeScript client application
│   ├── src/
│   │   ├── components/     # Customer, Admin, and common UI components
│   │   ├── layouts/        # CustomerLayout & AdminLayout
│   │   ├── pages/          # Customer storefront & Admin dashboard pages
│   │   ├── services/       # Axios API client & domain services
│   │   ├── stores/         # Zustand auth & cart stores
│   │   └── utils/          # Currency & formatting utilities
│   └── .env.example        # Public VITE_* environment template
├── backend/                # Express + TypeScript REST API
│   ├── prisma/             # Prisma schema & database seeder
│   ├── scripts/            # Automated integration & security test suite
│   ├── src/                # Controllers, services, routes, middlewares, validators
│   └── .env.example        # Server environment template
└── README.md
```

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/MuhammadFadhil04/coffeelo.git
cd coffeelo

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment Variables

Copy each `.env.example` to `.env` (real `.env` files are git-ignored):

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Update `DATABASE_URL` and `JWT_SECRET` inside `backend/.env` for your local MySQL instance.

### 3. Initialize Database & Seed Sample Data

```bash
cd backend
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Run Development Servers

**Backend (`http://localhost:5000`):**
```bash
cd backend
npm run dev
```

**Frontend (`http://localhost:5000` API -> `http://localhost:5173` Web):**
```bash
cd frontend
npm run dev
```

### 5. Build & Run Automated API Security Tests

```bash
cd backend && npm run build && npm test
cd ../frontend && npm run build
```
