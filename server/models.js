const mongoose = require('mongoose');

// ── PORTFOLIO DATA MODEL ──────────────────────────────
const portfolioSchema = new mongoose.Schema({
  hero: {
    name: { type: String, default: 'Chandru G' },
    roles: [{ type: String }],
    tagline: { type: String },
    availableForWork: { type: Boolean, default: true }
  },
  about: {
    bio1: { type: String },
    bio2: { type: String },
    profileImage: { type: String, default: 'profile.png' }
  },
  skills: [{
    category: String,
    icon: String,
    items: [{
      name: String,
      level: Number
    }]
  }],
  projects: [{
    title: String,
    tags: [String],
    problem: String,
    solution: String,
    stack: [String],
    demoUrl: String,
    githubUrl: String,
    thumbIcon: String,
    thumbClass: String
  }],
  services: [{
    icon: String,
    title: String,
    description: String,
    benefit: String
  }],
  stats: [{
    target: Number,
    suffix: String,
    label: String
  }],
  contact: {
    email: String,
    whatsapp: String,
    location: String
  },
  social: {
    github: String,
    linkedin: String,
    upwork: String,
    fiverr: String
  },
  techTags: [String]
}, { timestamps: true });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

// ── MESSAGES MODEL ────────────────────────────────────
const messageSchema = new mongoose.Schema({
  name:    String,
  email:   String,
  phone:   { type: String, default: '' },
  project: String,
  read:    { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// ── REVIEWS MODEL ─────────────────────────────────────
const reviewSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  company:   { type: String, default: '' },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  message:   { type: String, required: true },
  approved:  { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = { Portfolio, Message, Review };
