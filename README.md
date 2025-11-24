#  ECommerce – Full‑Stack MERN Store

Modern full‑stack E‑Commerce platform built with:

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Storefront:** React + Vite (customer website)
- **Admin Panel:** React + Vite (management dashboard)
- **Auth & Security:** JWT (access/refresh tokens), role‑based admin, email OTP verification, secure password reset
- **Payments & Media:** PayPal sandbox integration, Cloudinary image hosting

This repo contains everything you need to run a production‑style shop: product catalog, cart, checkout, orders, reviews, blog, banners, and an admin dashboard with sales analytics.

---

##  Project Structure

```text
ECommerce/
├─ server/   # Node.js + Express + MongoDB API
├─ client/   # Customer storefront (React + Vite)
└─ admin/    # Admin dashboard (React + Vite)
```

---

##  Key Features

### Storefront (client)

- Browse products by **category / sub‑category / third level category**
- Product details with images, pricing, stock, ratings and variants
- **Filters & search** by category, price range, rating, brand, etc.
- **Cart**: add/update/remove items, per‑user cart storage
- **Wishlist / My List**: save products to personal list
- **Checkout**:
  - Online payment (PayPal sandbox, Razorpay‑style flow)
  - Cash on Delivery option
- **Order history** for logged‑in users
- **Addresses**: add, edit, delete, and select delivery address
- **User accounts**:
  - Email OTP verification on registration
  - Secure password change (old password required)
  - **Forgot password** via email OTP + short‑lived reset token
- **Reviews**: add and view product reviews
- **Blog**: view blog posts (HTML description sanitized on server)

### Admin Panel (admin)

- **Authentication** (same user system, admin role required)
- **User management**:
  - Paginated list of users
  - Search, bulk delete, single delete (admin‑only)
- **Product management**:
  - Create / update / delete products
  - Upload product images / banner images (Cloudinary)
  - Manage RAM/Size/Weight options
- **Category management**:
  - Multi‑level categories (parent → sub → third level)
  - Create / update / delete categories and images
- **Order management**:
  - View all orders with filters & pagination
  - Update order status
  - Delete orders (admin‑only)
- **Content management**:
  - Home sliders, banners (2 layouts), logo
  - Blog posts with rich HTML description (stored sanitized)
- **Analytics dashboard**:
  - Total sales & monthly sales graph
  - Monthly user registrations graph

### Backend & Security

- **JWT auth** with access & refresh tokens
- Role‑based **admin middleware** (server/middlewares/admin.js)
- Secure password storage with **bcrypt**
- **Email OTP** for registration and forgot‑password
- Forgot‑password flow:
  - OTP verify → generates short‑lived, hashed reset token
  - Password can only be reset with that token (server‑validated)
- Ownership checks on sensitive resources:
  - Addresses, cart items, wishlists, reviews & user orders are
    always scoped to `request.userId`
- Blog descriptions are sanitized server‑side before saving
- File uploads via **multer** with images stored on **Cloudinary**
- Basic hardening via **helmet** and **cors**

> Note: You must provide your own environment secrets. Do **not** commit real API keys or passwords.

---

##  Getting Started

You’ll run three apps:

- `server` – API (port `8000` by default)
- `client` – storefront (Vite dev server)
- `admin` – admin dashboard (Vite dev server)

### 1. Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A **MongoDB** instance (Atlas or local)
- A **Cloudinary** account (for images)
- An SMTP email account (e.g. Gmail app password)
- PayPal sandbox app (optional, for test payments)

---

##  Server Setup (`server/`)

1. **Create environment file**

   In `server/.env` (do **not** commit this), define:

   ```ini
   PORT=8000
   MONGODB_URI="your-mongodb-connection-string"

   EMAIL="your-smtp-email@example.com"
   EMAIL_PASS="your-smtp-app-password"

   JSON_WEB_TOKEN_SECRET_KEY="long-random-secret-for-email-jwt"

   SECRET_KEY_ACCESS_TOKEN="long-random-secret-for-access-tokens"
   SECRET_KEY_REFRESH_TOKEN="long-random-secret-for-refresh-tokens"

   cloudinary_Config_Cloud_Name="your-cloud-name"
   cloudinary_Config_api_key="your-cloudinary-api-key"
   cloudinary_Config_api_secret="your-cloudinary-api-secret"

   PAYPAL_MODE=sandbox
   PAYPAL_CLIENT_ID_TEST="your-paypal-sandbox-client-id"
   PAYPAL_SECRET_TEST="your-paypal-sandbox-secret"
   PAYPAL_BASE_URL="https://api-m.sandbox.paypal.com"

   PAYPAL_CLIENT_ID_LIVE=""
   PAYPAL_SECRET_LIVE=""
   ```

2. **Install dependencies**

   ```bash
   cd server
   npm install
   ```

3. **(Recommended) Install blog sanitizer dependency**

   ```bash
   npm install isomorphic-dompurify
   ```

4. **Run the API**

   ```bash
   npm run dev    # uses nodemon
   # or
   npm start      # plain node
   ```

   The server listens on `http://localhost:8000` (or `PORT` you configure).

---

##  Storefront Setup (`client/`)

1. **Configure environment**

   In `client/`, create `.env` (or `.env.local`) with:

   ```ini
   VITE_API_URL="http://localhost:8000"
   ```

   Add other keys as needed (e.g. Razorpay/public keys used in checkout):

   ```ini
   VITE_APP_RAZORPAY_KEY_ID="your-razorpay-key-id"
   VITE_APP_RAZORPAY_KEY_SECRET="your-razorpay-key-secret-or-test-placeholder"
   ```

2. **Install & run**

   ```bash
   cd client
   npm install
   npm run dev
   ```

   By default Vite serves the app on something like `http://localhost:5173`.

---

##  Admin Panel Setup (`admin/`)

1. **Configure environment**

   In `admin/`, create `.env` (or `.env.local`):

   ```ini
   VITE_API_URL="http://localhost:8000"
   ```

2. **Install & run**

   ```bash
   cd admin
   npm install
   npm run dev
   ```

   Vite will serve the admin app on its own port (e.g. `http://localhost:5174`).

---

##  Authentication & Roles Overview

- Users register with email + password → receive OTP by email → verify → login.
- On login:
  - Access token (short‑lived) and refresh token (longer‑lived) are issued.
  - Refresh token is stored in the database and validated on refresh.
- **Admin users** are just users with `role: "ADMIN"` in the DB.
  - Admin‑only routes are protected by `auth` + `admin` middlewares on the server.
  - The admin React app also checks role client‑side, but server checks are authoritative.
- Forgot‑password:
  - User requests OTP → enters OTP → server issues a **short‑lived reset token**.
  - Password can only be changed via `forgot-password/change-password` with that token.

---

##  Useful Commands

From project root:

- Start API only:
  - `cd server && npm run dev`
- Start storefront only:
  - `cd client && npm run dev`
- Start admin only:
  - `cd admin && npm run dev`

In development, you’ll typically run all three in separate terminals.

---

##  Production Notes & Next Steps

Before deploying this project to production, you should:

- Replace all `.env` values with **strong, unique secrets** and production credentials.
- Ensure **HTTPS** is used so tokens and credentials are transmitted securely.
- Tighten **CORS** on the server to only allow your real frontend origins.
- Consider adding **rate limiting** on auth/OTP routes to reduce brute‑force attacks.
- Configure proper logging and monitoring around orders, payments and admin actions.

---

##  Contributing & Customization

This codebase is structured to be easy to extend:

- Add new models (e.g. coupons, gift cards, inventory logs) under `server/models/`.
- Add new API endpoints in `server/controllers/` + `server/route/`.
- Extend the storefront with new pages/components in `client/src/Pages` and `client/src/components`.
- Extend admin views in `admin/src/Pages` and `admin/src/Components`.


