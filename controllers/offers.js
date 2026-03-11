const db = require('../db');

module.exports.index = async (req, res) => {
    const { location } = req.query;
    let offers;
    if (location) {
        offers = db.prepare('SELECT * FROM offers WHERE location LIKE ? ORDER BY createdAt DESC').all(`%${location}%`);
    } else {
        offers = db.prepare('SELECT * FROM offers ORDER BY createdAt DESC').all();
    }
    res.render('offers/index', { offers, location });
};

module.exports.renderNewForm = (req, res) => {
    res.render('offers/new');
};

module.exports.createOffer = async (req, res) => {
    const { title, description, category, location, contact, quantity } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    db.prepare(
        'INSERT INTO offers (title, description, category, location, contact, quantity, image) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(title, description, category, location, contact, quantity, image);
    
    req.flash('success', 'Successfully added a new help offer!');
    res.redirect('/offers');
};

module.exports.showOffer = async (req, res) => {
    const offer = db.prepare('SELECT * FROM offers WHERE id = ?').get(req.params.id);
    if (!offer) {
        req.flash('error', 'Cannot find that offer!');
        return res.redirect('/offers');
    }
    res.render('offers/show', { offer });
};
