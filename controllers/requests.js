const db = require('../db');

module.exports.index = async (req, res) => {
    const { location } = req.query;
    let requests;
    if (location) {
        requests = db.prepare('SELECT * FROM requests WHERE location LIKE ? ORDER BY createdAt DESC').all(`%${location}%`);
    } else {
        requests = db.prepare('SELECT * FROM requests ORDER BY createdAt DESC').all();
    }
    res.render('requests/index', { requests, location });
};

module.exports.renderNewForm = (req, res) => {
    res.render('requests/new');
};

module.exports.createRequest = async (req, res) => {
    const { title, description, category, location, urgency } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const info = db.prepare(
        'INSERT INTO requests (title, description, category, location, urgency, image) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(title, description, category, location, urgency, image);
    
    req.flash('success', 'Successfully reported a new need!');
    res.redirect(`/requests/${info.lastInsertRowid}`);
};

module.exports.showRequest = async (req, res) => {
    const request = db.prepare('SELECT * FROM requests WHERE id = ?').get(req.params.id);
    if (!request) {
        req.flash('error', 'Cannot find that request!');
        return res.redirect('/requests');
    }
    
    const matchingOffers = db.prepare(`
        SELECT * FROM offers 
        WHERE category = ? 
        AND (location LIKE ? OR ? LIKE '%' || location || '%')
        AND available = 1
    `).all(request.category, `%${request.location}%`, request.location);

    res.render('requests/show', { request, matchingOffers });
};

module.exports.verifyRequest = async (req, res) => {
    const { id } = req.params;
    db.prepare('UPDATE requests SET verifiedCount = verifiedCount + 1 WHERE id = ?').run(id);
    res.redirect(`/requests/${id}`);
};

module.exports.resolveRequest = async (req, res) => {
    const { id } = req.params;
    db.prepare("UPDATE requests SET status = 'resolved' WHERE id = ?").run(id);
    res.redirect(`/requests/${id}`);
};
