# Chandru G — Portfolio with Admin Panel

A full-stack portfolio website with a password-protected admin panel to manage all content via MongoDB. Profile images are stored in **Cloudinary**.

---

## 📁 Project Structure

```
portfolio-admin/
├── server/
│   ├── index.js        ← Express server + all API routes
│   ├── models.js       ← MongoDB schemas (Portfolio, Message)
│   └── seedData.js     ← Default portfolio content
├── public/
│   ├── portfolio/      ← User-facing portfolio (dynamic)
│   │   ├── index.html
│   │   ├── style.css
│   │   ├── script.js
│   │   └── profile.png
│   └── admin/          ← Admin panel (password protected)
│       └── index.html
├── .env                ← Your secrets (DO NOT commit to git)
├── package.json
└── README.md
```

---

## 🚀 Setup & Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MongoDB

**Option A — Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/portfolio_db
```

**Option B — MongoDB Atlas (Free Cloud):**
1. Go to https://www.mongodb.com/atlas → Create free cluster
2. Click Connect → Connect your application → Copy URI
```
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/portfolio_db
```

### 3. Set Up Cloudinary (For Profile Image Upload)

1. Go to https://cloudinary.com and create a **free account**
2. On your dashboard, copy **Cloud Name**, **API Key**, **API Secret**
3. Paste them into `.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

That's it — when you upload a photo in the admin panel, it goes straight to Cloudinary and the URL is saved in MongoDB. The image persists even if you redeploy.

### 4. Set Your Admin Credentials
```env
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=YourSecurePass@123
JWT_SECRET=any_long_random_string
```

### 5. Start the Server
```bash
npm start
# or for auto-restart during development:
npm run dev
```

---

## 🌐 URLs

| URL | Description |
|-----|-------------|
| `http://localhost:3000/portfolio` | Your portfolio (public) |
| `http://localhost:3000/admin` | Admin panel (password protected) |
| `http://localhost:3000/api/portfolio` | Portfolio data API |

---

## 🔐 Admin Panel Features

| Section | What You Can Edit |
|---------|------------------|
| **Hero** | Name, tagline, typing roles, availability |
| **About** | Profile image (→ Cloudinary), bio paragraphs |
| **Skills** | Categories, skill names & levels, tech tags |
| **Projects** | Add/edit/remove projects, links, stack |
| **Services** | Add/edit/remove services |
| **Stats** | Animated counters |
| **Contact** | Email, WhatsApp, location |
| **Social** | GitHub, LinkedIn, Upwork, Fiverr |
| **Messages** | View form submissions, mark read, delete |

---

## 🔒 Admin Button on Portfolio

A subtle 🔐 button sits in the bottom-right corner of your portfolio. Only you know it's there — it links to `/admin`.

---

## 🚢 Deploy to Render (Free)

1. Push to GitHub (`.env` is in `.gitignore` — never commit it!)
2. Go to https://render.com → New Web Service
3. Connect your repo
4. Build command: `npm install`
5. Start command: `node server/index.js`
6. Add all `.env` variables in Render's Environment tab
7. Live at `*.onrender.com` 🎉

---

## 🛡️ Security Notes

- Change `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `JWT_SECRET` before deploying
- Never commit `.env` to GitHub
- JWT tokens expire in 8 hours
- Login is rate-limited (10 tries / 15 min)

---

Built with Node.js · Express · MongoDB · Cloudinary · Vanilla JS
