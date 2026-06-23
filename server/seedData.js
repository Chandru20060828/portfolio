const defaultPortfolio = {
  hero: {
    name: 'Chandru G',
    roles: ['Full Stack Developer', 'Backend Engineer', 'Freelance Developer', 'API Specialist', 'Web Architect'],
    tagline: 'I design and build scalable, fast, and modern web applications that help businesses grow online.',
    availableForWork: true
  },
  about: {
    bio1: "I'm Chandru G, a Full Stack Web Developer with hands-on experience building production-grade web applications — from responsive frontends to robust backend APIs and database systems.",
    bio2: "My approach goes beyond writing code. I focus on understanding the business problem first — then architect solutions that are fast, scalable, and maintainable. Whether it's a customer-facing web app, an admin dashboard, or a REST API powering a mobile product, I deliver clean, professional results on time.",
    profileImage: 'profile.png'
  },
  skills: [
    {
      category: 'Frontend', icon: '🎨',
      items: [
        { name: 'HTML5', level: 90 },
        { name: 'CSS3', level: 85 },
        { name: 'JavaScript (ES6+)', level: 82 }
      ]
    },
    {
      category: 'Backend', icon: '⚙️',
      items: [
        { name: 'Node.js', level: 80 },
        { name: 'Express.js', level: 78 },
        { name: 'REST APIs', level: 82 }
      ]
    },
    {
      category: 'Database', icon: '🗄️',
      items: [
        { name: 'MongoDB', level: 78 },
        { name: 'MySQL', level: 72 }
      ]
    },
    {
      category: 'Tools & DevOps', icon: '🛠️',
      items: [
        { name: 'Git / GitHub', level: 85 },
        { name: 'VS Code', level: 92 }
      ]
    }
  ],
  projects: [
    {
      title: 'LIC Advisor Web App',
      tags: ['Full Stack', 'Auth'],
      problem: 'LIC advisors had no centralized digital platform to manage plans, showcase brochures, or capture client leads.',
      solution: 'Built a full-featured web app with advisor dashboards, PDF brochure uploads, plan categories, JWT authentication, and MongoDB data storage.',
      stack: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Multer'],
      demoUrl: 'https://lic-a2rv.onrender.com/',
      githubUrl: 'https://github.com/Chandru20060828/lic',
      thumbIcon: '📊',
      thumbClass: 'thumb-1'
    },
    {
      title: 'BrainLink — Full Stack Application',
      tags: ['MERN', 'Payments'],
      problem: 'Communities needed a single platform to handle Q&A, user engagement, subscriptions, social interaction, and secure authentication in an organized and scalable way.',
      solution: 'Built a full-stack MERN community platform with subscription-based access, social posting features, multilingual support, gamification system, and secure login/authentication with role-based access control.',
      stack: ['MongoDB', 'Express', 'Node.js', 'Razorpay'],
      demoUrl: 'https://brainlink-ten.vercel.app/',
      githubUrl: 'https://github.com/Chandru20060828/brainlink',
      thumbIcon: '🧠',
      thumbClass: 'thumb-2'
    }
  ],
  services: [
    { icon: '🌐', title: 'Full Stack Web Development', description: 'Complete web applications from frontend UI to backend APIs and database — delivered as a working product ready for real users.', benefit: '→ Go from idea to live product fast' },
    { icon: '🎯', title: 'High-Conversion Landing Pages', description: 'Performance-optimized, mobile-first landing pages designed around your business goal — more leads, signups, or sales.', benefit: '→ Turn visitors into customers' },
    { icon: '⚡', title: 'REST API Development', description: 'Secure, documented, and scalable APIs built with Node.js and Express — ready to power your web or mobile app frontend.', benefit: '→ Backend that scales with you' },
    { icon: '🚀', title: 'Website Deployment', description: 'End-to-end deployment to cloud hosting, domain setup, SSL certificates, and environment configuration — so your site goes live without issues.', benefit: '→ From localhost to the world' },
    { icon: '🔒', title: 'Auth & Security Systems', description: 'Implement secure login systems with JWT, OTP verification, device fingerprinting, and login history — protect your users and your business.', benefit: '→ Security you can trust' },
    { icon: '✍️', title: 'Article & Blog Writing', description: 'SEO-friendly blog posts, website content, and informative articles crafted to engage readers, improve search rankings, and establish your online authority.', benefit: '→ Turning ideas into valuable content' }
  ],
  stats: [
    { target: 15, suffix: '+', label: 'Projects Completed' },
    { target: 10, suffix: '+', label: 'Happy Clients' },
    { target: 20, suffix: 'K+', label: 'Lines of Code' },
    { target: 100, suffix: '%', label: 'Client Satisfaction' }
  ],
  contact: {
    email: 'chandru2006tj@gmail.com',
    whatsapp: '919361454392',
    location: 'Tiruchirappalli, Tamil Nadu 🇮🇳'
  },
  social: {
    github: 'https://github.com/Chandru20060828',
    linkedin: '#',
    upwork: '#',
    fiverr: '#'
  },
  techTags: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'MySQL', 'REST API', 'JWT Auth', 'Git', 'GitHub', 'Multer', 'Mongoose']
};

module.exports = defaultPortfolio;
