const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const uploadDir = path.join(__dirname, '../../public/uploads/ads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${uuidv4()}${ext}`);
    }
});

function fileFilter(req, file, cb) {
    const allowed = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('File harus berupa gambar'));
    }
}

const upload = multer({ storage, fileFilter });

// Helper to build responsive srcset for uploaded images (assumes ads sizes)
function buildAdSrcSet(imageUrl, position) {
    // For simplicity, reuse the same URL; in production you'd generate variants
    if (position === 'banner') {
        return `${imageUrl} 728w`;
    }
    if (position === 'sidebar') {
        return `${imageUrl} 300w`;
    }
    return `${imageUrl} 600w`;
}

module.exports = { upload, buildAdSrcSet };

module.exports = { upload };


