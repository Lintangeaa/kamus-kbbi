const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
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
        // Always save as WebP
        cb(null, `${uuidv4()}.webp`);
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

// Process uploaded image to WebP with optimization
async function processImage(file, position) {
    const inputPath = file.path;
    const tempPath = inputPath.replace('.webp', '_temp.webp');
    
    try {
        let sharpInstance = sharp(inputPath);
        
        // Resize based on position
        if (position === 'banner') {
            sharpInstance = sharpInstance.resize(728, 90, { 
                fit: 'cover',
                position: 'center'
            });
        } else if (position === 'sidebar') {
            sharpInstance = sharpInstance.resize(300, 250, { 
                fit: 'cover',
                position: 'center'
            });
        }
        
        // Convert to WebP with optimization to temp file
        await sharpInstance
            .webp({ 
                quality: 85,
                effort: 6
            })
            .toFile(tempPath);
        
        // Move temp file to final location
        fs.renameSync(tempPath, inputPath);
            
        return true;
    } catch (error) {
        console.error('Error processing image:', error);
        // Clean up temp file if it exists
        if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
        }
        return false;
    }
}

// Helper to build responsive srcset for uploaded images
function buildAdSrcSet(imageUrl, position) {
    if (position === 'banner') {
        return `${imageUrl} 728w`;
    }
    if (position === 'sidebar') {
        return `${imageUrl} 300w`;
    }
    return `${imageUrl} 600w`;
}

module.exports = { upload, processImage, buildAdSrcSet };


