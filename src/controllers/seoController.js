const { getSeoData, updateSeoData, getPageSeo } = require('../models/seoModel');

// Admin views
function adminSeo(req, res) {
    const seoData = getSeoData();
    const { success, error } = req.query || {};
    res.render('admin/seo/index', {
        title: 'Pengaturan SEO',
        seoData,
        success: Boolean(success),
        error: Boolean(error),
        layout: 'admin/layout'
    });
}

function adminSeoUpdate(req, res) {
    const {
        siteTitle, siteDescription, siteKeywords, siteUrl, siteImage,
        homeTitle, homeDescription, homeKeywords,
        searchTitle, searchDescription, searchKeywords,
        aboutTitle, aboutDescription, aboutKeywords
    } = req.body;
    
    try {
        const updates = {
            site: {
                title: siteTitle,
                description: siteDescription,
                keywords: siteKeywords,
                url: siteUrl,
                image: siteImage
            },
            pages: {
                home: {
                    title: homeTitle,
                    description: homeDescription,
                    keywords: homeKeywords
                },
                search: {
                    title: searchTitle,
                    description: searchDescription,
                    keywords: searchKeywords
                },
                about: {
                    title: aboutTitle,
                    description: aboutDescription,
                    keywords: aboutKeywords
                }
            }
        };
        
        updateSeoData(updates);
        res.redirect('/admin/seo?success=1');
    } catch (error) {
        res.redirect('/admin/seo?error=1');
    }
}

// Public routes
function sitemap(req, res) {
    const { generateSitemap } = require('../models/seoModel');
    const urls = generateSitemap();
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    
    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
}

function robots(req, res) {
    const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /uploads/
Crawl-delay: 1

# Specific bot instructions
User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /uploads/

User-agent: Bingbot
Allow: /
Disallow: /admin/
Disallow: /uploads/

Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml`;
    
    res.set('Content-Type', 'text/plain');
    res.send(robots);
}

module.exports = {
    adminSeo,
    adminSeoUpdate,
    sitemap,
    robots
};
