module.exports.isLoggedIn = (req, res, next) => {
    // Placeholder for authentication logic
    // Since we don't have users yet, we'll just pass
    next();
};

module.exports.validateRequest = (req, res, next) => {
    const { title, location, category, urgency, description } = req.body;
    if (!title || !location || !category || !urgency || !description) {
        req.flash('error', 'All fields are required for a request');
        return res.redirect('/requests/new');
    }
    next();
};

module.exports.validateOffer = (req, res, next) => {
    const { title, location, category, contact, quantity, description } = req.body;
    if (!title || !location || !category || !contact || !quantity || !description) {
        req.flash('error', 'All fields are required for an offer');
        return res.redirect('/offers/new');
    }
    next();
};
