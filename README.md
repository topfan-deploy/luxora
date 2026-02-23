# Luxora - Premium E-Commerce Platform

A full-featured premium lifestyle e-commerce store built with Next.js 14, featuring multi-payment support (Stripe, PayPal, M-Pesa, MTN MoMo), a robust admin dashboard, and a responsive storefront.

---

## Architecture

```
                                  +---------------------+
                                  |   Next.js 14 App    |
                                  |  (React 18 + SSR)   |
                                  +----------+----------+
                                             |
                          +------------------+------------------+
                          |                                     |
                +---------v----------+              +-----------v-----------+
                |    Pages (SSR)     |              |     API Routes        |
                |  /products/[slug]  |              |  /api/auth            |
                |  /cart             |              |  /api/cart            |
                |  /checkout         |              |  /api/products        |
                |  /account/*        |              |  /api/checkout        |
                |  /admin/*          |              |  /api/admin/*         |
                +--------------------+              |  /api/webhooks        |
                                                    +-----------+-----------+
                                                                |
                     +------------------------------------------+------------------------------------------+
                     |                    |                      |                      |                   |
           +---------v--------+  +-------v--------+  +---------v--------+  +----------v-------+  +-------v--------+
           |  Prisma ORM      |  |  Stripe SDK    |  |  M-Pesa API      |  |  MTN MoMo API    |  |  NextAuth.js   |
           |  + PostgreSQL    |  |  (Cards)       |  |  (STK Push)      |  |  (RequestToPay)  |  |  (JWT)         |
           +---------+--------+  +----------------+  +------------------+  +------------------+  +----------------+
                     |
           +---------v--------+
           |   PostgreSQL     |
           |   Database       |
           +------------------+
```

---

## Tech Stack

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| Framework      | Next.js 14.2.35 (App Router)                    |
| Language       | TypeScript                                      |
| UI             | React 18, Tailwind CSS, Lucide Icons            |
| ORM / Database | Prisma ORM + PostgreSQL                         |
| Authentication | NextAuth.js (JWT strategy)                      |
| Payments       | Stripe SDK, PayPal, M-Pesa, MTN MoMo            |
| Validation     | Zod                                             |
| Carousels      | Swiper                                          |
| Charts         | Recharts                                        |
| IDs            | UUID                                            |

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (local or hosted)
- Stripe account (for card payments)
- M-Pesa developer credentials (optional, for mobile money)
- MTN MoMo developer credentials (optional, for mobile money)

### 1. Clone the repository

```bash
git clone https://github.com/topfan-deploy/luxora.git
cd luxora
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

See the [Environment Variables](#environment-variables) section below for the full list.

### 4. Push the database schema

```bash
npx prisma db push
```

### 5. Seed the database

```bash
npx prisma db seed
```

### 6. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## Project Structure

```
luxora/
├── prisma/
│   ├── schema.prisma          # Database schema (User, Product, Order, etc.)
│   └── seed.ts                # Seed script (sample products, categories, admin user)
│
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── page.tsx           # Home page (hero, featured products, categories)
│   │   ├── products/
│   │   │   └── [slug]/        # Product detail page
│   │   ├── cart/              # Shopping cart page
│   │   ├── checkout/          # Checkout flow
│   │   ├── account/
│   │   │   ├── profile/       # User profile management
│   │   │   ├── addresses/     # Saved addresses
│   │   │   ├── orders/        # Order history
│   │   │   └── password/      # Password change
│   │   └── admin/
│   │       ├── dashboard/     # Analytics dashboard
│   │       ├── products/      # Product CRUD
│   │       ├── orders/        # Order management
│   │       └── customers/     # Customer list
│   │
│   ├── app/api/               # API route handlers
│   │   ├── auth/              # NextAuth.js routes
│   │   ├── cart/              # Cart CRUD
│   │   ├── products/          # Product listing, search, filters
│   │   ├── categories/        # Category listing
│   │   ├── checkout/          # Checkout & payment initiation
│   │   ├── wishlist/          # Wishlist add/remove/list
│   │   ├── newsletter/        # Newsletter subscription
│   │   ├── account/           # Profile, addresses, password
│   │   ├── admin/             # Admin-only endpoints
│   │   └── webhooks/          # Stripe & mobile money callbacks
│   │
│   ├── lib/                   # Shared server-side utilities
│   │   ├── auth.ts            # NextAuth configuration & helpers
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── stripe.ts          # Stripe client initialization
│   │   ├── utils.ts           # General utility functions
│   │   ├── validation.ts      # Zod schemas
│   │   └── payments/
│   │       └── mobile-money/  # M-Pesa & MTN MoMo integrations
│   │
│   ├── components/            # React components
│   │   ├── ui/                # Buttons, inputs, modals, badges, etc.
│   │   ├── layout/            # Header, footer, sidebar, navigation
│   │   ├── home/              # Hero banner, featured sections
│   │   ├── product/           # Product card, gallery, reviews
│   │   └── cart/              # Cart item, cart summary, mini-cart
│   │
│   ├── context/               # React context providers
│   │   ├── CartContext.tsx     # Cart state (localStorage + DB hybrid)
│   │   └── ToastContext.tsx    # Toast notification system
│   │
│   └── hooks/                 # Custom React hooks
│       ├── useCart.ts          # Cart operations hook
│       ├── useDebounce.ts     # Input debounce for search
│       └── useWishlist.ts     # Wishlist operations hook
│
├── public/                    # Static assets (images, icons)
├── tailwind.config.ts         # Tailwind CSS configuration
├── next.config.js             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── package.json
```

---

## API Endpoints

### Authentication

| Method | Endpoint                      | Description                  | Auth     |
| ------ | ----------------------------- | ---------------------------- | -------- |
| POST   | `/api/auth/register`          | Register a new user          | Public   |
| POST   | `/api/auth/[...nextauth]`     | NextAuth sign-in / sign-out  | Public   |

### Products

| Method | Endpoint                       | Description                                    | Auth     |
| ------ | ------------------------------ | ---------------------------------------------- | -------- |
| GET    | `/api/products`                | List products (search, filter, sort, paginate) | Public   |
| GET    | `/api/products/[slug]`         | Get single product by slug                     | Public   |
| GET    | `/api/products/[slug]/reviews` | Get product reviews                            | Public   |
| POST   | `/api/products/[slug]/reviews` | Submit a product review                        | Customer |

### Categories

| Method | Endpoint                      | Description                  | Auth     |
| ------ | ----------------------------- | ---------------------------- | -------- |
| GET    | `/api/categories`             | List all categories          | Public   |

### Cart

| Method | Endpoint                      | Description                  | Auth     |
| ------ | ----------------------------- | ---------------------------- | -------- |
| GET    | `/api/cart`                   | Get cart items               | Customer |
| POST   | `/api/cart`                   | Add item to cart             | Customer |
| PATCH  | `/api/cart`                   | Update item quantity         | Customer |
| DELETE | `/api/cart`                   | Remove item from cart        | Customer |
| POST   | `/api/cart/merge`             | Merge guest cart on login    | Customer |

### Checkout

| Method | Endpoint                      | Description                           | Auth     |
| ------ | ----------------------------- | ------------------------------------- | -------- |
| POST   | `/api/checkout`               | Create order and initiate payment     | Customer |
| POST   | `/api/checkout/apply-coupon`  | Validate and apply a coupon code      | Customer |

### Wishlist

| Method | Endpoint                      | Description                  | Auth     |
| ------ | ----------------------------- | ---------------------------- | -------- |
| GET    | `/api/wishlist`               | Get wishlist items           | Customer |
| POST   | `/api/wishlist`               | Add product to wishlist      | Customer |
| DELETE | `/api/wishlist`               | Remove product from wishlist | Customer |

### Newsletter

| Method | Endpoint                      | Description                  | Auth     |
| ------ | ----------------------------- | ---------------------------- | -------- |
| POST   | `/api/newsletter`             | Subscribe to newsletter      | Public   |

### Account

| Method | Endpoint                      | Description                  | Auth     |
| ------ | ----------------------------- | ---------------------------- | -------- |
| GET    | `/api/account/profile`        | Get user profile             | Customer |
| PATCH  | `/api/account/profile`        | Update user profile          | Customer |
| GET    | `/api/account/addresses`      | List saved addresses         | Customer |
| POST   | `/api/account/addresses`      | Add a new address            | Customer |
| PATCH  | `/api/account/addresses`      | Update an address            | Customer |
| DELETE | `/api/account/addresses`      | Delete an address            | Customer |
| POST   | `/api/account/password`       | Change password              | Customer |
| GET    | `/api/account/orders`         | Get order history            | Customer |

### Admin

| Method | Endpoint                          | Description                                                        | Auth  |
| ------ | --------------------------------- | ------------------------------------------------------------------ | ----- |
| GET    | `/api/admin/analytics`            | Dashboard stats (revenue, orders, top products, category breakdown) | Admin |
| GET    | `/api/admin/products`             | List all products (admin view)                                     | Admin |
| POST   | `/api/admin/products`             | Create a new product                                               | Admin |
| PATCH  | `/api/admin/products/[id]`        | Update a product                                                   | Admin |
| DELETE | `/api/admin/products/[id]`        | Delete a product                                                   | Admin |
| POST   | `/api/admin/products/[id]/images` | Upload product images                                              | Admin |
| GET    | `/api/admin/orders`               | List all orders                                                    | Admin |
| PATCH  | `/api/admin/orders/[id]`          | Update order status                                                | Admin |
| GET    | `/api/admin/customers`            | List all customers                                                 | Admin |

### Webhooks

| Method | Endpoint                        | Description                        | Auth           |
| ------ | ------------------------------- | ---------------------------------- | -------------- |
| POST   | `/api/webhooks/stripe`          | Stripe payment event callbacks     | Stripe Signing |
| POST   | `/api/webhooks/mpesa`           | M-Pesa STK push callback          | IP Whitelist   |
| POST   | `/api/webhooks/mtn-momo`        | MTN MoMo payment callback         | Signature      |

---

## Payment Methods

### Stripe (Card Payments)

Standard card payment flow using Stripe Payment Intents. Supports Visa, Mastercard, Amex, and other major card networks. Webhook confirmation ensures reliable order fulfillment even if the user closes the browser.

### PayPal

PayPal integration for users who prefer to pay through their PayPal balance or linked bank accounts.

### M-Pesa (Kenya)

M-Pesa STK (SIM Toolkit) Push integration for mobile money payments in Kenya. When a customer selects M-Pesa at checkout:

1. The server initiates an STK Push request to the Safaricom Daraja API.
2. The customer receives a push notification on their phone to enter their M-Pesa PIN.
3. Upon confirmation, M-Pesa sends a callback to `/api/webhooks/mpesa`.
4. The order status is updated to PROCESSING.

### MTN Mobile Money (Uganda, Ghana, West Africa)

MTN MoMo Collections API (RequestToPay) integration for mobile money payments across multiple African markets. When a customer selects MTN MoMo at checkout:

1. The server sends a RequestToPay to the MTN MoMo API.
2. The customer receives a prompt on their phone to authorize the payment.
3. The server polls or receives a callback at `/api/webhooks/mtn-momo`.
4. The order status is updated to PROCESSING.

---

## Environment Variables

| Variable                       | Description                                            | Example                                    |
| ------------------------------ | ------------------------------------------------------ | ------------------------------------------ |
| `DATABASE_URL`                 | PostgreSQL connection string                           | `postgresql://user:pass@host:5432/luxora`  |
| `NEXTAUTH_SECRET`              | Secret for signing JWT tokens                          | `your-random-secret-string`                |
| `NEXTAUTH_URL`                 | Canonical URL of the application                       | `http://localhost:3000`                    |
| `STRIPE_SECRET_KEY`            | Stripe secret API key                                  | `sk_live_...`                              |
| `STRIPE_PUBLISHABLE_KEY`       | Stripe publishable (client-side) key                   | `pk_live_...`                              |
| `STRIPE_WEBHOOK_SECRET`        | Stripe webhook endpoint signing secret                 | `whsec_...`                                |
| `MPESA_CONSUMER_KEY`           | Safaricom Daraja API consumer key                      | `AbCdEf123456`                             |
| `MPESA_CONSUMER_SECRET`        | Safaricom Daraja API consumer secret                   | `AbCdEf123456`                             |
| `MPESA_SHORTCODE`              | M-Pesa business shortcode (paybill or till number)     | `174379`                                   |
| `MPESA_PASSKEY`                | M-Pesa online passkey                                  | `bfb279f9...`                              |
| `MPESA_ENVIRONMENT`            | M-Pesa environment (`sandbox` or `production`)         | `sandbox`                                  |
| `MTN_MOMO_SUBSCRIPTION_KEY`    | MTN MoMo API subscription key                          | `abcdef123456`                             |
| `MTN_MOMO_API_USER`            | MTN MoMo API user UUID                                 | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`     |
| `MTN_MOMO_API_KEY`             | MTN MoMo API key                                       | `abcdef123456`                             |
| `MTN_MOMO_ENVIRONMENT`         | MTN MoMo environment (`sandbox` or `production`)       | `sandbox`                                  |
| `MOBILE_MONEY_PROVIDERS`       | Comma-separated list of enabled mobile money providers | `mpesa,mtn-momo`                           |
| `NEXT_PUBLIC_APP_URL`          | Public-facing app URL (used in client-side code)       | `https://luxora.up.railway.app`            |

---

## Order Statuses

Orders progress through the following lifecycle:

```
  PENDING ──────> PROCESSING ──────> SHIPPED ──────> DELIVERED
     │                │                  │
     │                │                  │
     v                v                  v
  CANCELLED       CANCELLED          REFUNDED
```

| Status       | Description                                                        |
| ------------ | ------------------------------------------------------------------ |
| `PENDING`    | Order created, awaiting payment confirmation.                      |
| `PROCESSING` | Payment confirmed, order is being prepared for shipment.           |
| `SHIPPED`    | Order has been handed off to the carrier with tracking info.       |
| `DELIVERED`  | Order has been delivered to the customer.                          |
| `CANCELLED`  | Order was cancelled before delivery (by customer or admin).        |
| `REFUNDED`   | Payment was refunded after delivery (returns, disputes).           |

---

## Shopping Cart (Hybrid Strategy)

The cart uses a hybrid persistence strategy:

- **Guest users**: Cart items are stored in `localStorage` on the client. No account required to start shopping.
- **Logged-in users**: Cart items are stored in the PostgreSQL database via the Cart API.
- **Auto-merge on login**: When a guest user signs in, any items in their `localStorage` cart are automatically merged with their database cart via `/api/cart/merge`. Duplicate products have their quantities summed. The `localStorage` cart is then cleared.

---

## Admin Features

Access the admin dashboard at `/admin` (requires `ADMIN` role).

### Analytics Dashboard

- Total revenue, order count, and average order value
- Revenue trend chart (Recharts line/bar chart)
- Top-selling products
- Category breakdown (pie chart)
- Recent orders summary

### Product Management

- Full CRUD for products (create, read, update, delete)
- Image upload and management (multiple images per product)
- Category assignment
- Stock and inventory tracking
- Price and discount management

### Order Management

- View all orders with filters (by status, date range, customer)
- Update order status through the lifecycle
- View order details (items, shipping address, payment info)

### Customer Management

- View all registered customers
- Customer order history
- Account status overview

---

## Role-Based Access Control

| Role       | Permissions                                                                                                                       |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `CUSTOMER` | Browse products, manage cart, place orders, manage own account, write reviews, manage wishlist                                     |
| `ADMIN`    | All customer permissions plus access to admin dashboard, product CRUD, order management, customer management, and analytics        |

---

## Running Tests

```bash
npm run test
```

---

## Deployment

The application is deployed on **Railway** and the source code is hosted at:

[https://github.com/topfan-deploy/luxora](https://github.com/topfan-deploy/luxora)

### Deployment Checklist

1. Set all required environment variables in your Railway project settings.
2. Ensure the PostgreSQL database is provisioned and `DATABASE_URL` is configured.
3. Run `npx prisma db push` to apply the schema to the production database.
4. Run `npx prisma db seed` to populate initial data (categories, sample products, admin user).
5. Configure Stripe webhook endpoint to point to `https://<your-domain>/api/webhooks/stripe`.
6. Configure M-Pesa and MTN MoMo callback URLs if mobile money is enabled.

---

## License

Proprietary. All rights reserved.
