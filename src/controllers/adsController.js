const path = require('path');
const fs = require('fs');
const { getAllAds, getAdById, createAd, updateAd, deleteAd } = require('../models/adsModel');
const { processImage } = require('../middleware/upload');

// Helper function to delete old image file
function deleteOldImage(imageUrl) {
    if (imageUrl && imageUrl.startsWith('/uploads/ads/')) {
        const imagePath = path.join(__dirname, '../../public', imageUrl);
        if (fs.existsSync(imagePath)) {
            try {
                fs.unlinkSync(imagePath);
                console.log('Deleted old image:', imagePath);
            } catch (error) {
                console.error('Error deleting old image:', error);
            }
        }
    }
}

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
async function adminCreate(req, res) {
    const payload = parseAdPayload(req);
    
    // Process image if uploaded
    if (req.file) {
        const success = await processImage(req.file, payload.position);
        if (!success) {
            return res.status(500).render('error', { 
                title: 'Error',
                error: 'Gagal memproses gambar'
            });
        }
    }
    
    createAd(payload);
    res.redirect('/admin/ads');
}

async function adminUpdate(req, res) {
    const adId = req.params.id;
    const existingAd = getAdById(adId);
    if (!existingAd) return res.status(404).render('404', { title: 'Halaman Tidak Ditemukan' });
    
    const payload = parseAdPayload(req);
    
    // Process image if uploaded
    if (req.file) {
        // Delete old image if exists
        if (existingAd.imageUrl) {
            deleteOldImage(existingAd.imageUrl);
        }
        
        const success = await processImage(req.file, payload.position);
        if (!success) {
            return res.status(500).render('error', { 
                title: 'Error',
                error: 'Gagal memproses gambar'
            });
        }
    }
    
    const updated = updateAd(adId, payload);
    if (!updated) return res.status(404).render('404', { title: 'Halaman Tidak Ditemukan' });
    res.redirect('/admin/ads');
}

function adminDelete(req, res) {
    const adId = req.params.id;
    const existingAd = getAdById(adId);
    
    if (existingAd) {
        // Delete associated image file
        if (existingAd.imageUrl) {
            deleteOldImage(existingAd.imageUrl);
        }
    }
    
    deleteAd(adId);
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


