const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const fs = require('fs');
// Ads management
const adminAdsRoutes = require('./src/routes/admin/adminAdsRoutes');
const { getActiveAds } = require('./src/models/adsModel');
const session = require('express-session');
const publicRoutes = require('./src/routes/publicRoutes');
const adminAuthRoutes = require('./src/routes/adminAuthRoutes');
const adminRoutes = require('./src/routes/admin/adminRoutes');
const { requireAdmin } = require('./src/middleware/auth');
const { setAdminLayout } = require('./src/middleware/adminLayout');
const { textCompression } = require('./src/middleware/compression');

// Load KBBI data
const kbbiData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'kbbi.json'), 'utf8'));

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// Middleware
app.use(textCompression()); // Enable text compression
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'kbbi-secret',
  resave: false,
  saveUninitialized: false
}));

// Expose active ads to public views only
app.use((req, res, next) => {
  // Skip ads for admin routes
  if (req.path.startsWith('/admin')) {
    res.locals.adsBanner = null;
    res.locals.adsSidebar = null;
    return next();
  }
  
  try {
    const activeAds = getActiveAds();
    const bannerAd = activeAds.find(a => a.position === 'banner');
    const sidebarAd = activeAds.find(a => a.position === 'sidebar');
    res.locals.adsBanner = bannerAd || null;
    res.locals.adsSidebar = sidebarAd || null;
  } catch (e) {
    res.locals.adsBanner = null;
    res.locals.adsSidebar = null;
  }
  next();
});

// Public routes
app.use('/', publicRoutes);

// Admin auth (no admin layout here)
app.use('/admin', adminAuthRoutes);

// Admin protected routes with admin layout
app.use('/admin', requireAdmin, setAdminLayout, adminRoutes);
// (Public handlers moved to publicRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { 
    title: 'Halaman Tidak Ditemukan'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Error',
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
