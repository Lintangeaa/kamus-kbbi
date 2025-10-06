const express = require('express');
const seoRoutes = express.Router();
const { adminSeo, adminSeoUpdate } = require('../../controllers/seoController');


// Admin SEO routes
seoRoutes.get('',  adminSeo);
seoRoutes.post('', adminSeoUpdate);


module.exports = seoRoutes;
