const fs = require('fs');
const path = require('path');

const SEO_DATA_PATH = path.join(__dirname, '../../data/seo.json');

function readSeoData() {
    if (!fs.existsSync(SEO_DATA_PATH)) {
        const defaultData = {
            site: {
                title: "Kamus KBBI Online - Kamus Besar Bahasa Indonesia",
                description: "Kamus Besar Bahasa Indonesia (KBBI) online gratis. Cari arti kata, definisi, dan contoh penggunaan kata dalam bahasa Indonesia dengan mudah dan cepat.",
                keywords: "kamus, kbbi, bahasa indonesia, kamus online, definisi kata, arti kata, kamus besar bahasa indonesia",
                author: "Soulcode",
                url: "https://kamus-kbbi.com",
                image: "/images/og-image.jpg",
                twitter: "@soulcode",
                facebook: "soulcode"
            },
            pages: {}
        };
        writeSeoData(defaultData);
        return defaultData;
    }
    const raw = fs.readFileSync(SEO_DATA_PATH, 'utf8');
    return JSON.parse(raw || '{}');
}

function writeSeoData(data) {
    fs.writeFileSync(SEO_DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function getSeoData() {
    return readSeoData();
}

function updateSeoData(updates) {
    const data = readSeoData();
    const updated = { ...data, ...updates };
    writeSeoData(updated);
    return updated;
}

function getPageSeo(pageKey, customData = {}) {
    const seoData = readSeoData();
    const site = seoData.site || {};
    const page = seoData.pages?.[pageKey] || {};
    
    return {
        title: customData.title || page.title || site.title,
        description: customData.description || page.description || site.description,
        keywords: customData.keywords || page.keywords || site.keywords,
        author: site.author,
        url: customData.url || site.url,
        image: customData.image || site.image,
        twitter: site.twitter,
        facebook: site.facebook
    };
}

function generateSitemap() {
    const seoData = readSeoData();
    const baseUrl = seoData.site?.url || 'https://kamus-kbbi.com';
    
    const urls = [
        {
            loc: baseUrl,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'daily',
            priority: '1.0'
        },
        {
            loc: `${baseUrl}/search`,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'daily',
            priority: '0.9'
        },
        {
            loc: `${baseUrl}/privacy`,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'monthly',
            priority: '0.7'
        },
        {
            loc: `${baseUrl}/terms`,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'monthly',
            priority: '0.7'
        },
        {
            loc: `${baseUrl}/contact`,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'monthly',
            priority: '0.7'
        },
        {
            loc: `${baseUrl}/about`,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'monthly',
            priority: '0.7'
        }
    ];
    
    return urls;
}

module.exports = {
    getSeoData,
    updateSeoData,
    getPageSeo,
    generateSitemap
};
