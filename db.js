const Database = require('better-sqlite3');
const db = new Database('crisismesh.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    urgency TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    verifiedCount INTEGER DEFAULT 0,
    image TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    contact TEXT NOT NULL,
    quantity TEXT,
    available INTEGER DEFAULT 1,
    image TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration for existing tables
try {
    db.exec("ALTER TABLE requests ADD COLUMN image TEXT;");
} catch (e) {
    // Column might already exist
}
try {
    db.exec("ALTER TABLE offers ADD COLUMN image TEXT;");
} catch (e) {
    // Column might already exist
}

// Seed sample data if empty
const requestCount = db.prepare('SELECT COUNT(*) as count FROM requests').get().count;
if (requestCount === 0) {
    db.prepare(`
        INSERT INTO requests (title, description, category, location, urgency, status, image) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
        'Urgent: Oxygen Cylinder Needed', 
        'Patient in critical condition at home needs an oxygen cylinder immediately. We have a prescription but cannot find a supplier.', 
        'Medical', 
        'Kolkata, West Bengal', 
        'Critical', 
        'open',
        'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=1000'
    );
    db.prepare(`
        INSERT INTO requests (title, description, category, location, urgency, status, image) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
        'Food for 20 Stranded Workers', 
        'A group of 20 migrant workers are stranded near the railway station and haven\'t eaten in 24 hours. Need dry rations or cooked meals.', 
        'Food', 
        'Chennai, Tamil Nadu', 
        'High', 
        'open',
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1000'
    );
}

const offerCount = db.prepare('SELECT COUNT(*) as count FROM offers').get().count;
if (offerCount === 0) {
    db.prepare(`
        INSERT INTO offers (title, description, category, location, contact, quantity, image) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
        'Free Tele-Medical Consultation', 
        'I am a general physician offering free tele-consultation for non-emergency cases to help reduce the burden on hospitals.', 
        'Medical', 
        'Remote / Online', 
        '+91 98765 43210', 
        'Unlimited',
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000'
    );
    db.prepare(`
        INSERT INTO offers (title, description, category, location, contact, quantity, image) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
        'Community Hall for Shelter', 
        'Our community center is open for anyone needing temporary shelter. We have clean water, mats, and basic sanitation facilities.', 
        'Shelter', 
        'Mumbai, Maharashtra', 
        '022-24455667', 
        '50 People',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000'
    );
}

// Force update broken images if they exist
db.prepare("UPDATE offers SET image = ? WHERE title = ?").run(
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000',
    'Community Hall for Shelter'
);

module.exports = db;
