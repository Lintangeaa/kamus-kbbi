const compression = require('compression');

// Text compression middleware
function textCompression() {
    return compression({
        level: 6, // Compression level (1-9)
        threshold: 1024, // Only compress files larger than 1KB
        filter: (req, res) => {
            // Only compress text-based content
            if (req.headers['x-no-compression']) {
                return false;
            }
            return compression.filter(req, res);
        }
    });
}

module.exports = { textCompression };
