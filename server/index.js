require('dotenv').config();
const express      = require('express');
const mongoose     = require('mongoose');
const jwt          = require('jsonwebtoken');
const cors         = require('cors');
const path         = require('path');
const multer       = require('multer');
const rateLimit    = require('express-rate-limit');
const cloudinary   = require('cloudinary').v2;
const streamifier  = require('streamifier');

const { Portfolio, Message, Review } = require('./models');
const defaultData = require('./seedData');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARE ────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' }
});

// ── CLOUDINARY CONFIG ─────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── FILE UPLOAD (memory → Cloudinary) ────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'));
  }
});

// Helper: stream buffer to Cloudinary
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'portfolio',
        public_id: 'profile',
        overwrite: true,
        resource_type: 'image',
        transformation: [{ width: 600, height: 600, crop: 'fill', gravity: 'face', quality: 'auto' }]
      },
      (error, result) => { if (error) reject(error); else resolve(result); }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}


// ── STATIC FILES ──────────────────────────────────────
// Serve files from public root
app.use(express.static(path.join(__dirname, '../public')));

app.use('/portfolio', express.static(path.join(__dirname, '../public/portfolio')));
app.use('/admin',     express.static(path.join(__dirname, '../public/admin')));

// ── MONGODB CONNECTION ────────────────────────────────
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
    await seedIfEmpty();
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('ℹ️  Running without DB — data will not persist');
  }
}

async function seedIfEmpty() {
  const count = await Portfolio.countDocuments();
  if (count === 0) {
    await Portfolio.create(defaultData);
    console.log('✅ Portfolio seeded with default data');
  }
}

// ── JWT AUTH MIDDLEWARE ───────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ══════════════════════════════════════════════════════
//  PUBLIC API ROUTES
// ══════════════════════════════════════════════════════

// GET all portfolio data
app.get('/api/portfolio', async (req, res) => {
  try {
    let data = await Portfolio.findOne();
    if (!data) data = defaultData;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load portfolio' });
  }
});

// POST contact form submission
app.post('/api/contact', async (req, res) => {
  const { name, email, project } = req.body;
  const phone = (req.body.phone || '').trim();
  if (!name || !email || !project)
    return res.status(400).json({ error: 'All fields required' });
  try {
    await Message.create({ name, email, phone, project });
    res.json({ success: true, message: "Message sent! I'll get back to you within 24 hours." });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// ══════════════════════════════════════════════════════
//  ADMIN AUTH ROUTES
// ══════════════════════════════════════════════════════

app.post('/api/admin/login', authLimiter, (req, res) => {
  const { username, password } = req.body;
  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD)
    return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ role: 'admin', username }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, expiresIn: '8h' });
});

app.get('/api/admin/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, admin: req.admin.username });
});

// ══════════════════════════════════════════════════════
//  ADMIN PORTFOLIO CRUD ROUTES (protected)
// ══════════════════════════════════════════════════════

app.get('/api/admin/portfolio', authMiddleware, async (req, res) => {
  try {
    const data = await Portfolio.findOne() || defaultData;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load portfolio' });
  }
});

app.put('/api/admin/portfolio', authMiddleware, async (req, res) => {
  try {
    let data = await Portfolio.findOne();
    if (!data) { data = await Portfolio.create(req.body); }
    else { Object.assign(data, req.body); await data.save(); }
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update portfolio' });
  }
});

app.patch('/api/admin/portfolio/:section', authMiddleware, async (req, res) => {
  const { section } = req.params;
  const allowed = ['hero','about','skills','projects','services','stats','contact','social','techTags'];
  if (!allowed.includes(section)) return res.status(400).json({ error: 'Invalid section' });
  try {
    let data = await Portfolio.findOne();
    if (!data) data = await Portfolio.create(defaultData);
    data[section] = req.body[section] !== undefined ? req.body[section] : req.body;
    await data.save();
    res.json({ success: true, section, updated: data[section] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update section: ' + err.message });
  }
});

// ── PROFILE IMAGE UPLOAD → CLOUDINARY ────────────────
app.post('/api/admin/upload-image', authMiddleware, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
  try {
    // Upload buffer directly to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);
    const imageUrl = result.secure_url;

    // Save URL in MongoDB
    let data = await Portfolio.findOne();
    if (data) {
      data.about.profileImage = imageUrl;
      await data.save();
    }

    res.json({ success: true, imageUrl });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ error: 'Upload to Cloudinary failed: ' + err.message });
  }
});

// ── MESSAGES ──────────────────────────────────────────
app.get('/api/admin/messages', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

app.patch('/api/admin/messages/:id/read', authMiddleware, async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

app.delete('/api/admin/messages/:id', authMiddleware, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// ── REVIEWS (PUBLIC) ──────────────────────────────────
// GET approved reviews for portfolio display
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load reviews' });
  }
});

// POST submit a new review (public, goes to pending)
app.post('/api/reviews', async (req, res) => {
  const { name, company, rating, message } = req.body;
  if (!name || !rating || !message)
    return res.status(400).json({ error: 'Name, rating, and message are required' });
  if (rating < 1 || rating > 5)
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  try {
    await Review.create({ name, company: company || '', rating: parseInt(rating), message });
    res.json({ success: true, message: 'Thank you! Your review has been submitted for approval.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save review' });
  }
});

// ── REVIEWS (ADMIN) ───────────────────────────────────
// GET all reviews (pending + approved)
app.get('/api/admin/reviews', authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load reviews' });
  }
});

// PATCH approve a review
app.patch('/api/admin/reviews/:id/approve', authMiddleware, async (req, res) => {
  try {
    await Review.findByIdAndUpdate(req.params.id, { approved: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve review' });
  }
});

// DELETE a review
app.delete('/api/admin/reviews/:id', authMiddleware, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// ── SERVE PAGES ───────────────────────────────────────
app.get('/',         (req, res) => res.redirect('/portfolio'));
app.get('/portfolio',(req, res) => res.sendFile(path.join(__dirname, '../public/portfolio/index.html')));
app.get('/admin',    (req, res) => res.sendFile(path.join(__dirname, '../public/admin/index.html')));
app.get('/admin/*',  (req, res) => res.sendFile(path.join(__dirname, '../public/admin/index.html')));

// ── START ─────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}`);
    console.log(`📁 Portfolio:  http://localhost:${PORT}/portfolio`);
    console.log(`🔐 Admin:      http://localhost:${PORT}/admin`);
    console.log(`☁️  Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? '✅ Configured' : '❌ Not configured — add keys to .env'}\n`);
  });
});
