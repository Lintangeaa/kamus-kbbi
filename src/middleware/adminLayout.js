function setAdminLayout(req, res, next) {
    // Set admin layout for this request
    res.locals.layout = 'admin/layout';
    // Expose current path for active sidebar highlighting
    res.locals.currentPath = (req.baseUrl || '') + (req.path || '');
    next();
}

module.exports = { setAdminLayout };


