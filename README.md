# DIET Ghazipur — Website, Admin Console & Portals

Stack: **React (Vite) + Node/Express + MongoDB (Mongoose)**. Live updates via Server-Sent Events.

## Run locally
```bash
# 1. MongoDB must be running (local, or a free Atlas cluster URI)
cd server
cp .env.example .env        # set JWT_SECRET, MONGO_URI, admin password
npm install
npm run seed                # creates admin + demo notices/events
npm run dev                 # API on :5000

# new terminal
cd client
npm install
npm run dev                 # site on http://localhost:5173
```
Admin login: `/staff/login` (email/password from `.env`). Student login/registration: `/student/login`.

## Production (single server)
```bash
cd client && npm run build
cd ../server && npm start   # serves API + built React app + /uploads
```
Put it behind Nginx with HTTPS. Back up the `server/uploads` folder and the MongoDB database daily.

## Roles
| Role | Can do |
|---|---|
| admin | everything, incl. creating staff accounts, resetting passwords, disabling users |
| staff | publish/delete notices, carousel, gallery, events; approve/reject applications; read messages |
| student | self-register, apply to programmes, upload documents, track status |

## Edit before going live
- `client/src/config.js`: **exact DIET coordinates**, address, phone, email, principal's name/message, map places.
- `server/.env`: strong `JWT_SECRET`, new admin password (change immediately after first login).
- Replace placeholder text in About page; add official logos.

## Government hosting checklist
Gov sites usually need a **GIGW** accessibility/security audit, hosting on NIC / state data centre, and an `.gov.in`/`.ac.in` domain.
Consider adding: Hindi translation (i18n), CAPTCHA on login, email/SMS OTP, audit log, malware scan on uploads, move uploads to S3-compatible storage.

## Deploying (Vercel + a Node host)

The site (client) goes on Vercel. The API (server) is a long-running Express app with live updates (SSE), so host it on
Render, Railway or Fly (free/low-cost plans work) — not as a Vercel serverless function.

1. **API on Render**: New Web Service → root directory `server` → build `npm install` → start `npm start`.
   Environment: `MONGO_URI` (Atlas), `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`,
   `CLIENT_ORIGIN=https://<your-vercel-domain>` (comma-separate more domains).
   Run `npm run seed` once (Render shell, or locally with the same `MONGO_URI`).
   In Atlas → Network Access allow `0.0.0.0/0` (Render IPs change).
2. **Site on Vercel**: import the repo, root directory `client`, framework Vite.
   Environment variable: `VITE_API_URL=https://<your-api>.onrender.com` (no trailing slash), then redeploy.
3. Open the Vercel URL, log in at Staff login.
