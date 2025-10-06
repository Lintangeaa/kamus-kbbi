const express = require('express');
const adminAdsRoutes = express.Router();
const { upload } = require('../../middleware/upload');
const {
    adminList,
    adminCreateForm,
    adminEditForm,
    adminCreate,
    adminUpdate,
    adminDelete
} = require('../../controllers/adsController');

adminAdsRoutes.get('', adminList);
adminAdsRoutes.get('/new', adminCreateForm);
adminAdsRoutes.post('', upload.single('image'), adminCreate);
adminAdsRoutes.get('/:id/edit', adminEditForm);
adminAdsRoutes.post('/:id', upload.single('image'), adminUpdate);
adminAdsRoutes.post('/:id/delete', adminDelete);

module.exports = adminAdsRoutes;


