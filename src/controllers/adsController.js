const path = require('path');
const { getAllAds, getAdById, createAd, updateAd, deleteAd } = require('../models/adsModel');

function parseAdPayload(req) {
    const { name, linkUrl, position, startDate, endDate, isPublished } = req.body;
    const payload = {
        name: (name || '').trim(),
        linkUrl: (linkUrl || '').trim(),
        position: position || 'banner',
        startDate: startDate || null,
        endDate: endDate || null,
        isPublished: isPublished === 'on' || isPublished === true
    };
    if (req.file) {
        payload.imageUrl = `/uploads/ads/${req.file.filename}`;
    }
    return payload;
}

// Views
function adminList(req, res) {
    const ads = getAllAds();
    res.render('admin/ads/index', { 
        title: 'Kelola Iklan', 
        ads,
        layout: 'admin/layout'
    });
}

function adminCreateForm(req, res) {
    res.render('admin/ads/create', { 
        title: 'Tambah Iklan',
        layout: 'admin/layout'
    });
}

function adminEditForm(req, res) {
    const ad = getAdById(req.params.id);
    if (!ad) return res.status(404).render('404', { title: 'Halaman Tidak Ditemukan' });
    res.render('admin/ads/edit', { 
        title: 'Edit Iklan', 
        ad,
        layout: 'admin/layout'
    });
}

// Actions
function adminCreate(req, res) {
    const payload = parseAdPayload(req);
    createAd(payload);
    res.redirect('/admin/ads');
}

function adminUpdate(req, res) {
    const payload = parseAdPayload(req);
    const updated = updateAd(req.params.id, payload);
    if (!updated) return res.status(404).render('404', { title: 'Halaman Tidak Ditemukan' });
    res.redirect('/admin/ads');
}

function adminDelete(req, res) {
    deleteAd(req.params.id);
    res.redirect('/admin/ads');
}

module.exports = {
    adminList,
    adminCreateForm,
    adminEditForm,
    adminCreate,
    adminUpdate,
    adminDelete
};


