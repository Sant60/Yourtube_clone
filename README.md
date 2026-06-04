# YourTube Clone

A YouTube-inspired full-stack video platform.

- **Frontend**: Next.js 15 (Pages Router) + Tailwind CSS v4 + shadcn/ui → deploy to **Vercel**
- **Backend**: Express 5 + MongoDB (Mongoose) → deploy to **Render**
- **Auth**: Firebase Google Sign-in

---

## Quick Start

### 1. Backend (server/)

```bash
cd server
cp .env.example .env      # fill in DB_URL and CLIENT_URL
npm install
npm run dev               # starts on http://localhost:5000
```

### 2. Frontend (client/)

```bash
cd client
cp .env.example .env.local   # fill in NEXT_PUBLIC_* values
npm install
npm run dev                  # starts on http://localhost:3000
```

---

## Deploying

### Backend → Render

1. Push the `server/` folder to a GitHub repo (or the full monorepo)
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set **Root Directory** to `server`
4. Build command: `npm install` · Start command: `npm start`
5. Add environment variables in the Render dashboard:
   - `DB_URL` — MongoDB Atlas connection string
   - `CLIENT_URL` — your Vercel frontend URL (e.g. `https://your-app.vercel.app`)

### Frontend → Vercel

1. Push the `client/` folder (or the full monorepo)
2. Import the repo on [vercel.com](https://vercel.com)
3. Set **Root Directory** to `client`
4. Add environment variables:
   - `NEXT_PUBLIC_BACKEND_URL` — your Render backend URL (no trailing slash)
   - All `NEXT_PUBLIC_FIREBASE_*` values from Firebase Console

---

## Architecture

```
client/ (Next.js - Vercel)
  src/
    pages/          ← Pages Router
    components/     ← UI components
    lib/            ← axios, firebase, auth context

server/ (Express - Render)
  routes/           ← Express routers
  controllers/      ← Business logic
  Modals/           ← Mongoose schemas
  filehelper/       ← Multer config
  uploads/          ← Video storage (local; use cloud storage for production)
```

> **Note:** The `uploads/` folder is local disk storage, which Render's free tier
> will wipe on each deploy. For production, integrate **Cloudinary** or **AWS S3**.
