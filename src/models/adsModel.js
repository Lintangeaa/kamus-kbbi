const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const ADS_DATA_PATH = path.join(__dirname, '../../data/ads.json');

function readAdsFile() {
    if (!fs.existsSync(ADS_DATA_PATH)) {
        fs.writeFileSync(ADS_DATA_PATH, '[]', 'utf8');
    }
    const raw = fs.readFileSync(ADS_DATA_PATH, 'utf8');
    return JSON.parse(raw || '[]');
}

function writeAdsFile(data) {
    fs.writeFileSync(ADS_DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function getAllAds() {
    return readAdsFile();
}

function getAdById(adId) {
    const ads = readAdsFile();
    return ads.find(a => a.id === adId) || null;
}

function createAd(ad) {
    const ads = readAdsFile();
    const nowIso = new Date().toISOString();
    const newAd = {
        id: uuidv4(),
        name: ad.name,
        imageUrl: ad.imageUrl || '',
        linkUrl: ad.linkUrl || '',
        position: ad.position || 'banner', // 'banner' | 'sidebar'
        startDate: ad.startDate || nowIso,
        endDate: ad.endDate || null,
        isPublished: Boolean(ad.isPublished),
        createdAt: nowIso,
        updatedAt: nowIso
    };
    ads.push(newAd);
    writeAdsFile(ads);
    return newAd;
}

function updateAd(adId, updates) {
    const ads = readAdsFile();
    const idx = ads.findIndex(a => a.id === adId);
    if (idx === -1) return null;
    const nowIso = new Date().toISOString();
    ads[idx] = {
        ...ads[idx],
        ...updates,
        isPublished: updates.isPublished !== undefined ? Boolean(updates.isPublished) : ads[idx].isPublished,
        updatedAt: nowIso
    };
    writeAdsFile(ads);
    return ads[idx];
}

function deleteAd(adId) {
    const ads = readAdsFile();
    const filtered = ads.filter(a => a.id !== adId);
    writeAdsFile(filtered);
}

function isAdActive(ad, now = new Date()) {
    if (!ad.isPublished) return false;
    const startOk = ad.startDate ? new Date(ad.startDate) <= now : true;
    const endOk = ad.endDate ? now <= new Date(ad.endDate) : true;
    return startOk && endOk;
}

function getActiveAds(now = new Date()) {
    const ads = readAdsFile();
    return ads.filter(ad => isAdActive(ad, now));
}

module.exports = {
    getAllAds,
    getAdById,
    createAd,
    updateAd,
    deleteAd,
    getActiveAds,
    isAdActive
};


