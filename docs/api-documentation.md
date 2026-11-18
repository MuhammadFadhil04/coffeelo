# Coffeelo — REST API Specification

Base URL: `http://localhost:5000/api`

## Response Envelope Standard

All responses strictly follow standard JSON responses:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation error or error description",
  "errors": [ ... ]
}
```

---

## Endpoints Overview

### System & Health
- `GET /health` — Service health status check

### Authentication (`/auth`)
- `POST /auth/register` — Register a customer account
- `POST /auth/login` — Login customer/admin, returns JWT token & user info
- `GET /auth/me` — Get authenticated user profile (Bearer JWT required)

### Categories (`/categories`)
- `GET /categories` — List all categories (Public)
- `POST /categories` — Create category (Admin)
- `PUT /categories/:id` — Update category (Admin)
- `DELETE /categories/:id` — Delete category (Admin)

### Products (`/products`)
- `GET /products` — List products with search, category filter, sorting, pagination (Public)
- `GET /products/:id_or_slug` — Get product detail with variants (Public)
- `POST /products` — Create new product with variants (Admin)
- `PUT /products/:id` — Update product (Admin)
- `DELETE /products/:id` — Soft-delete / deactivate product (Admin)

### Orders (`/orders`)
- `POST /orders` — Create order with transactional stock validation (Auth)
- `GET /orders/my` — Get order history for current customer (Auth)
- `GET /orders/:id` — Get single order detail (Auth / Admin)
- `GET /admin/orders` — List orders with filters & pagination (Admin)
- `PATCH /admin/orders/:id/status` — Transition order status (Admin)

### Payments (`/payments`)
- `POST /payments/create` — Generate Midtrans Snap token for order (Auth)
- `POST /payments/webhook` — Midtrans notification webhook (Signature Verified)
- `GET /payments/:orderId` — Check payment status (Auth / Admin)

### Admin Analytics & Reports (`/admin`)
- `GET /admin/dashboard/summary` — KPI stats (Revenue, Orders, Customers, AOV)
- `GET /admin/dashboard/sales` — Sales timeline analytics chart
- `GET /admin/dashboard/top-products` — Best-selling products
- `GET /admin/reports/sales` — Detailed financial & product sales report
