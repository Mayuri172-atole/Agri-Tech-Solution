# 🌱 Agri-Tech-Solution v2.0
### By SEMENA Hybrid Seeds (India) Private Limited

---

## 🚀 Quick Start

### Backend (Server)
```bash
cd server
npm install
# Create .env file:
# MONGO_URI=mongodb://localhost:27017/agritech
# JWT_SECRET=your_jwt_secret_key_here
# PORT=5000
npm run dev
```

### Frontend (Client)
```bash
cd client
npm install
npm run dev
```

---

## ✨ What's New in v2.0

### 🔐 Seller Verification & Auto-Blocking System
- **User Schema** — New fields: `status`, `rejectionCount`, `loginAttempts`
- **Rule 1** — Admin rejects 3+ times → Status auto-set to `Auto-Rejected`
- **Rule 2** — 5+ suspicious login attempts → Account permanently `Blocked`
- **Backend** — `PUT /api/users/approve/:id`, `PUT /api/users/reject/:id`, `PUT /api/users/block/:id`

### 📹 Video-First Platform (AgriTube)
- **No Photo Policy** — Only video files accepted (`video/*` MIME type enforced)
- **Multer** — Video-only file filter, 500MB limit, stored in `public/uploads/videos/`
- **Video Model** — MongoDB schema with `isApproved`, `category`, `uploader`
- **Admin moderation** — Approve/delete videos from Admin Dashboard

### 🏛 Admin Dashboard — 3 Tables
1. **User Management** — All users, roles, licence numbers, live status, Approve/Reject/Block actions
2. **Security Audit** — Flagged accounts with rejection counts and login attempt tracking
3. **Video Moderation** — All platform videos, approve or delete

### 👤 Profile Page
- No profile photo — Uses **initials avatar** (no image upload)
- Shows user stats: total uploads, approved, pending
- "My Uploads" grid — all videos by the logged-in user
- Dealer status alerts (Pending / Blocked)

### 🏷 SEMENA Branding
- **Navbar** — Company header band with SVG logo, company name, tagline, contact info
- **All auth pages** — Professional SEMENA branding header
- All Hindi/colloquial language removed — professional English throughout

---

## 📁 New Files

### Server
| File | Description |
|------|-------------|
| `models/Video.js` | Video schema with approval workflow |
| `controllers/videoController.js` | Upload, fetch, approve, delete |
| `routes/videoRoutes.js` | Multer + video API endpoints |
| `controllers/authController.js` | Updated with auto-blocking logic |
| `routes/authRoutes.js` | New approve/reject/block routes |
| `middleware/authMiddleware.js` | Blocked account check on every request |

### Client
| File | Description |
|------|-------------|
| `components/Navbar.jsx` | SEMENA branded navbar with company header |
| `styles/Navbar.css` | Professional green/white theme |
| `pages/AgriTube.jsx` | Video feed + upload panel |
| `pages/Profile.jsx` | User profile with initials + video uploads |
| `pages/AdminDashboard/AdminHome.jsx` | 3-table admin dashboard |
| `pages/auth/CustomerLogin.jsx` | Branded login |
| `pages/auth/CustomerSignup.jsx` | Validated signup with strength check |
| `pages/auth/SupplierLogin.jsx` | Seller portal login |
| `pages/auth/SupplierSignup.jsx` | Seller signup with licence validation |

---

## 🔒 Security Rules Reference

```
Rejection Count > 3   → status = "Auto-Rejected" (isActive = false)
Login Attempts >= 5   → status = "Blocked" (isActive = false, permanent)
isActive = false      → JWT middleware blocks all requests
```

---

## 📞 Company Contact
- **SEMENA Hybrid Seeds (India) Pvt. Ltd.**
- Phone: +091 9518930913
- Email: semena_india@hotmail.com
- Website: www.semenahybridseeds.com
- CIN: U52609MH2018PTC303967
AgriMart@172
qrns snez ngyo rgkn