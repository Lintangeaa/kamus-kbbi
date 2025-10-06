const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { getPageSeo } = require('../models/seoModel');
const { sitemap, robots } = require('../controllers/seoController');

// Load KBBI data once at module load
const kbbiData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data', 'kbbi.json'), 'utf8'));

router.get('/sitemap.xml', sitemap);
router.get('/robots.txt', robots);

router.get('/', (req, res) => {
  const seoData = getPageSeo('home');
  res.render('index', { 
    title: 'Kamus KBBI',
    subtitle: 'Kamus Besar Bahasa Indonesia',
    seoData
  });
});

router.get('/search', (req, res) => {
  const query = req.query.q;
  const seoData = getPageSeo('search', {
    title: query ? `Hasil Pencarian "${query}" - Kamus KBBI` : 'Pencarian KBBI',
    description: query ? `Definisi dan arti kata "${query}" dalam Kamus Besar Bahasa Indonesia` : 'Cari arti kata dalam Kamus Besar Bahasa Indonesia'
  });
  
  if (!query) {
    return res.render('search', { 
      title: 'Pencarian KBBI',
      query: '',
      results: [],
      message: 'Masukkan kata yang ingin dicari',
      seoData
    });
  }

  const searchResults = [];
  const searchTerm = (query || '').toLowerCase().trim();
  
  if (kbbiData.kata[searchTerm]) {
    const wordData = kbbiData.kata[searchTerm];
    searchResults.push({
      word: searchTerm,
      ejaan: wordData.ejaan,
      kata_dasar: wordData.kata_dasar,
      kelas_kata: wordData.kelas_kata,
      definition: wordData.definisi,
      examples: wordData.contoh || []
    });
  } else {
    for (const [word, data] of Object.entries(kbbiData.kata)) {
      if (word.includes(searchTerm) || searchTerm.includes(word)) {
        searchResults.push({
          word: word,
          ejaan: data.ejaan,
          kata_dasar: data.kata_dasar,
          kelas_kata: data.kelas_kata,
          definition: data.definisi,
          examples: data.contoh || []
        });
      }
    }
  }

  res.render('search', { 
    title: 'Hasil Pencarian',
    query: query,
    results: searchResults,
    message: searchResults.length === 0 ? `Kata "${query}" tidak ditemukan dalam kamus` : null,
    seoData
  });
});

router.get('/about', (req, res) => {
  const seoData = getPageSeo('about');
  res.render('about', { 
    title: 'Tentang KBBI',
    seoData
  });
});

router.get('/privacy', (req, res) => {
  const seoData = getPageSeo('privacy', {
    title: 'Kebijakan Privasi - Kamus KBBI',
    description: 'Kebijakan privasi Kamus KBBI Online. Pelajari bagaimana kami melindungi dan menggunakan informasi pribadi Anda.',
    keywords: 'kebijakan privasi, perlindungan data, privasi pengguna, kamus kbbi'
  });
  res.render('privacy', { 
    title: 'Kebijakan Privasi',
    seoData
  });
});

router.get('/terms', (req, res) => {
  const seoData = getPageSeo('terms', {
    title: 'Syarat dan Ketentuan - Kamus KBBI',
    description: 'Syarat dan ketentuan penggunaan Kamus KBBI Online. Baca aturan dan ketentuan sebelum menggunakan layanan kami.',
    keywords: 'syarat ketentuan, terms of use, aturan penggunaan, kamus kbbi'
  });
  res.render('terms', { 
    title: 'Syarat dan Ketentuan',
    seoData
  });
});

router.get('/contact', (req, res) => {
  const seoData = getPageSeo('contact', {
    title: 'Hubungi Kami - Kamus KBBI',
    description: 'Hubungi tim Kamus KBBI untuk pertanyaan, saran, atau bantuan teknis. Kami siap membantu Anda.',
    keywords: 'hubungi kami, kontak, customer service, bantuan, kamus kbbi'
  });
  res.render('contact', { 
    title: 'Hubungi Kami',
    seoData
  });
});

module.exports = router;


