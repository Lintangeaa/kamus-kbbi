const express = require('express');
const adminAuthRoutes = express.Router();

// Simple hardcoded login: admin / admin
adminAuthRoutes.get('/login', (req, res) => {
    if (req.session && req.session.isAdmin) return res.redirect('/admin');
    res.render('admin/login', { 
        title: 'Admin Login', 
        error: null,
        layout: false
    });
});

adminAuthRoutes.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin') {
        req.session.isAdmin = true;
        return res.redirect('/admin');
    }
    res.status(401).render('admin/login', { 
        title: 'Admin Login', 
        error: 'Username atau password salah',
        layout: false
    });
});

adminAuthRoutes.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/admin/login');
    });
});

module.exports = adminAuthRoutes;


