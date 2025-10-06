const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/auth');
const { getAllAds, isAdActive } = require('../../models/adsModel');
const seoRoutes = require('./seoRoutes');
const AdminAdsRoutes = require('./adminAdsRoutes');


// Ensure layout is admin for these routes
router.use(requireAdmin);

router.get('/', (req, res) => {
    const ads = getAllAds();
    const totalAds = ads.length;
    const now = new Date();
    const activeAdsCount = ads.filter(a => isAdActive(a, now)).length;
    const scheduledAdsCount = ads.filter(a => a.isPublished && a.startDate && new Date(a.startDate) > now).length;
    const draftAdsCount = ads.filter(a => !a.isPublished).length;
    res.render('admin/dashboard', { 
        title: 'Dashboard', 
        totalAds,
        activeAdsCount,
        scheduledAdsCount,
        draftAdsCount,
        layout: 'admin/layout'
    });
});

router.use('/ads', AdminAdsRoutes);
router.use('/seo', seoRoutes);


module.exports = router;


