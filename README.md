# Kamus KBBI

Kamus Besar Bahasa Indonesia (KBBI) Website menggunakan Express.js dan EJS.

**Created by [Soulcode](https://soulcode.com)** ❤️

## Fitur

- ✅ Pencarian kata dengan interface yang responsif
- ✅ Desain modern menggunakan Bootstrap 5
- ✅ Layout yang responsif untuk semua perangkat
- ✅ Error handling yang baik
- ✅ Animasi dan interaksi yang smooth

## Teknologi yang Digunakan

- **Backend**: Node.js, Express.js
- **Template Engine**: EJS dengan express-ejs-layouts
- **Frontend**: Bootstrap 5, Font Awesome, Custom CSS/JS
- **Runtime**: Bun

## Instalasi

1. Clone atau download project ini
2. Install dependencies:
   ```bash
   bun install
   ```

3. Jalankan server:
   ```bash
   bun run dev
   ```

4. Buka browser dan akses: `http://localhost:3000`

## Scripts

- `bun run dev` - Menjalankan server dalam mode development
- `bun run start` - Menjalankan server dalam mode production
- `bun run watch` - Menjalankan server dengan auto-reload

## Struktur Project

```
kamus-kbbi/
├── views/              # EJS templates
│   ├── layout.ejs     # Layout utama
│   ├── index.ejs      # Halaman beranda
│   ├── search.ejs     # Halaman pencarian
│   ├── about.ejs      # Halaman tentang
│   ├── 404.ejs        # Halaman 404
│   └── error.ejs      # Halaman error
├── public/            # Static files
│   ├── css/          # Stylesheet
│   ├── js/           # JavaScript
│   └── images/       # Gambar
├── server.js         # File server utama
├── package.json      # Dependencies dan scripts
└── README.md         # Dokumentasi
```

## Pengembangan

Untuk pengembangan lebih lanjut, Anda dapat:

1. Menambahkan database untuk menyimpan data kamus
2. Implementasi API untuk pencarian
3. Menambahkan fitur bookmark kata
4. Implementasi autocomplete yang lebih canggih
5. Menambahkan fitur sharing

## Lisensi

MIT License
