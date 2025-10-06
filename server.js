const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const fs = require('fs');

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
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Kamus KBBI',
    subtitle: 'Kamus Besar Bahasa Indonesia'
  });
});

app.get('/search', (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.render('search', { 
      title: 'Pencarian KBBI',
      query: '',
      results: [],
      message: 'Masukkan kata yang ingin dicari'
    });
  }

  // Search in KBBI data
  const searchResults = [];
  const searchTerm = query.toLowerCase().trim();
  
  if (kbbiData.kata[searchTerm]) {
    const wordData = kbbiData.kata[searchTerm];
    searchResults.push({
      word: searchTerm,
      definition: wordData.definisi,
      examples: wordData.contoh || []
    });
  } else {
    // Try partial matching
    for (const [word, data] of Object.entries(kbbiData.kata)) {
      if (word.includes(searchTerm) || searchTerm.includes(word)) {
        searchResults.push({
          word: word,
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
    message: searchResults.length === 0 ? `Kata "${query}" tidak ditemukan dalam kamus` : null
  });
});

app.get('/about', (req, res) => {
  res.render('about', { 
    title: 'Tentang KBBI'
  });
});

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
