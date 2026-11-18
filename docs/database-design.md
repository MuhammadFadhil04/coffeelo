# Coffeelo — Database Design & ERD Specification

Database: `coffeelo_db` (MySQL + Prisma ORM)

## Entity Relationship Overview

### 1. `users`
- `id` (UUID / VarChar(36), PK)
- `name` (VarChar(100))
- `email` (VarChar(191), Unique)
- `password` (VarChar(255))
- `phone` (VarChar(20), Nullable)
- `avatarUrl` (VarChar(255), Nullable)
- `role` (Enum: `CUSTOMER`, `ADMIN`, Default: `CUSTOMER`)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### 2. `addresses`
- `id` (UUID, PK)
- `userId` (UUID, FK -> users.id)
- `recipientName` (VarChar(100))
- `phone` (VarChar(20))
- `addressLine` (Text)
- `city` (VarChar(100))
- `postalCode` (VarChar(10))
- `isPrimary` (Boolean, Default: false)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### 3. `categories`
- `id` (UUID, PK)
- `name` (VarChar(100))
- `slug` (VarChar(100), Unique)
- `description` (Text, Nullable)
- `imageUrl` (VarChar(255), Nullable)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### 4. `products`
- `id` (UUID, PK)
- `categoryId` (UUID, FK -> categories.id)
- `name` (VarChar(150))
- `slug` (VarChar(150), Unique)
- `description` (Text)
- `basePrice` (Decimal(10, 2))
- `imageUrl` (VarChar(255))
- `stock` (Int, Default: 0)
- `isAvailable` (Boolean, Default: true)
- `isFeatured` (Boolean, Default: false)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `deletedAt` (DateTime, Nullable - Soft delete)

### 5. `product_variants`
- `id` (UUID, PK)
- `productId` (UUID, FK -> products.id)
- `name` (VarChar(50)) -- e.g., Size (Regular, Large), Bean Roast (Light, Medium, Dark), Milk Type (Oat, Dairy)
- `optionValue` (VarChar(50))
- `priceAdjustment` (Decimal(10, 2), Default: 0.00)
- `stock` (Int, Default: 0)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### 6. `orders`
- `id` (UUID, PK)
- `orderNumber` (VarChar(50), Unique) -- e.g. CFL-20261119-XXXX
- `userId` (UUID, FK -> users.id)
- `type` (Enum: `PICKUP`, `DELIVERY`)
- `status` (Enum: `PENDING`, `CONFIRMED`, `PROCESSING`, `READY`, `ON_DELIVERY`, `COMPLETED`, `CANCELLED`)
- `subtotal` (Decimal(10, 2))
- `deliveryFee` (Decimal(10, 2), Default: 0.00)
- `discount` (Decimal(10, 2), Default: 0.00)
- `totalAmount` (Decimal(10, 2))
- `notes` (Text, Nullable)
- `shippingAddressSnapshot` (JSON, Nullable) -- Complete address frozen at checkout time
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### 7. `order_items`
- `id` (UUID, PK)
- `orderId` (UUID, FK -> orders.id)
- `productId` (UUID, FK -> products.id)
- `productName` (VarChar(150)) -- Snapshot
- `productImageUrl` (VarChar(255)) -- Snapshot
- `unitPrice` (Decimal(10, 2)) -- Snapshot
- `quantity` (Int)
- `subtotal` (Decimal(10, 2))
- `createdAt` (DateTime)

### 8. `order_item_options`
- `id` (UUID, PK)
- `orderItemId` (UUID, FK -> order_items.id)
- `variantName` (VarChar(50)) -- e.g. "Size: Large"
- `priceAdjustment` (Decimal(10, 2))

### 9. `order_status_history`
- `id` (UUID, PK)
- `orderId` (UUID, FK -> orders.id)
- `status` (Enum: OrderStatus)
- `comment` (VarChar(255), Nullable)
- `createdAt` (DateTime)

### 10. `payments`
- `id` (UUID, PK)
- `orderId` (UUID, Unique, FK -> orders.id)
- `paymentMethod` (VarChar(50), Nullable) -- e.g. Midtrans Snap / GoPay / BCA
- `transactionId` (VarChar(100), Nullable) -- Midtrans transaction ID
- `grossAmount` (Decimal(10, 2))
- `status` (Enum: `PENDING`, `PAID`, `FAILED`, `EXPIRED`, `REFUNDED`)
- `snapToken` (VarChar(255), Nullable)
- `snapRedirectUrl` (VarChar(255), Nullable)
- `payloadJson` (JSON, Nullable) -- Webhook payload logs
- `paidAt` (DateTime, Nullable)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### 11. `reviews`
- `id` (UUID, PK)
- `userId` (UUID, FK -> users.id)
- `productId` (UUID, FK -> products.id)
- `rating` (Int) -- 1 to 5
- `comment` (Text)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### 12. `store_settings`
- `id` (UUID, PK)
- `key` (VarChar(100), Unique)
- `value` (Text)
- `updatedAt` (DateTime)
