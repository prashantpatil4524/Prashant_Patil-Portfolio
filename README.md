# Portfolio Website - Full-Stack Admin Panel & Security Guide

This repository contains your modern, responsive portfolio website. It has been transformed into a secure full-stack application utilizing an **Express.js** backend coupled with **Mongoose (MongoDB Atlas)** persistence, comprehensive security filters, and user features.

---

## 🛠️ Summary of Today's Key Upgrades

### 1. 🖼️ Google Drive Direct Image Engine
* **The Problem:** Direct Google Drive links (e.g., `https://drive.google.com/file/d/...`) do not render natively in `<img>` HTML tags because they are document viewer pages rather than direct image streams.
* **The Solution:** Added a resilient link parsing utility (`/src/utils.ts`) that instantly intercepts, matches, and transforms sharing paths (including `/file/d/` IDs, `?id=` queries, and dynamic exports) into high-performance, web-addressable direct asset endpoints:
  ```
  https://lh3.googleusercontent.com/d/YOUR_FILE_ID
  ```
* **Prerequisites:** In Google Drive, click **Share** -> Change general access to **"Anyone with the link can view"** so the web browser has public reader access to present the image.

### 2. 🔌 Live MongoDB Atlas Integration & Seeding
* **Database Models (`/server/models.ts`):** Defined MongoDB Schemas using strict Type-Safe properties for authorization (`Admin`), inquiries (`Message`), and the portfolio state CMS (`Portfolio`).
* **Auto-Seeding (`/server/db.ts`):** When the application boots, Mongoose automatically inspects the cluster. If it is empty, it securely populates the collection with your default projects, experience matrices, and initial info from `mockData.ts`.
* **Zero Downtime Fallback:** If MongoDB is offline, unconfigured, or experiencing IP blocking, the Express server gracefully switches to responsive in-memory persistence. Your site continues to serve and collect inquiries with no crashes.

### 3. 🔒 Advanced Production-Grade Security Layout
* **Environment Isolation:** Crucial keys (`MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`) are externalized to your environment variables and `.env` template. They are declared in `.env.example` and strictly ignored in `.gitignore` so they are **never exposed to GitHub**.
* **Brute-Force Rate Limiting:** Added `express-rate-limit` to the `/api/auth/login` ingress endpoint. Limits each IP address to **max 10 login attempts per 15 minutes**, shielding you from automated password scanning tools.
* **Sealed Session Tokens (JWT):** Admin sessions are authenticated using JSON Web Tokens.
  - Secret key is loaded via a high-entropy string (`JWT_SECRET`).
  - Strict session expiry threshold of **7 days max**.
  - All adjustments inside the Admin Panel require a verified `Bearer` Authorization token header.
* **Irreversible Password Hashing:** Core Admin passwords are never saved in plain text. Hashed with **12 salt rounds** using `bcryptjs` before verification.
* **No Client-Side Account Creation:** To eliminate vulnerabilities, there are no public sign-up or registration routes. There is exactly one administrator account managed securely.

---

## 🧭 Step-by-Step Security & Database Connectivity Setup

Because your backend is hosted in a secure Cloud Run container, **you must configure MongoDB Atlas to receive incoming connections** from your live application.

### Step 1: Whitelist Connection IPs in MongoDB Atlas
If your portfolio displays a database connection error (like `MongooseServerSelectionError`), your cluster is blocking requests from the hosting environment. 

1. Go to your [MongoDB Atlas Dashboard](https://cloud.mongodb.com/).
2. In the left navigation menu, under the **Security** header, click on **Network Access**.
3. Click the green **IP Access List** / **Add IP Address** button.
4. To allow your server instance to talk to Atlas, enter `0.0.0.0/0` (this allows connections from anywhere, which is correct and required for dynamic Cloud Run auto-scaling IPs). 
5. Provide an entry name like `Cloud Ingress Allow` and click **Confirm**.

### Step 2: Configure Environment Variables
Locally, create a file named `.env` in your root folder. On Vercel or your hosting dashboard, add these identical variables under **Project Settings ➔ Environment Variables**:

```env
# 🪐 MongoDB Atlas Connection String
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/portfolio?retryWrites=true&w=majority"

# 🔑 Strict Cryptographic JWT Token Secret
JWT_SECRET="a_highly_secure_phrase_at_least_32_characters_long_for_entropy"

# 👤 Main Admin Account Login credentials
ADMIN_EMAIL="prashantpatil4524@gmail.com"
ADMIN_PASSWORD="Choose-A-Very-Strong-Password-Here"
```

*Note: For the setup on Vercel or other platforms, do NOT upload the local physical `.env` file to your public git code repository.*

---

## 🚀 Running the Full-Stack App Locally

Ensure you have Node.js installed, then execute:

```bash
# 1. Install newly integrated packages (Mongoose, BCryptJS, Express, JWT, etc.)
npm install

# 2. Start the integrated Express API Backend & Vite Hot Dev Server concurrently
npm run dev
```

* The client interface and Express backend bind seamlessly to **Port `3000`** as required.
* Edit profile imagery, update records, and collect visitor message inquiries with absolute confidence!
