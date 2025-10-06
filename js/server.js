const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'growth_mindset.sqlite');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Unable to open database', err);
  } else {
    console.log(`Connected to Growth Mindset database at ${DB_PATH}`);
  }
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) {
        console.error('Failed to create subscribers table', err);
      }
    }
  );
});

app.use(express.json());

app.post('/api/growth-mindset', (req, res) => {
  const rawName = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const rawEmail = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';

  if (!rawName) {
    return res.status(400).json({ message: 'Name is required.' });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(rawEmail)) {
    return res.status(400).json({ message: 'A valid email address is required.' });
  }

  const stmt = db.prepare('INSERT INTO subscribers (name, email) VALUES (?, ?)');
  stmt.run(rawName, rawEmail, function (err) {
    stmt.finalize();
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        return res.status(200).json({
          message: 'Email already captured.',
          redirectUrl: 'https://dl.bookfunnel.com/hp2x1pfp1p'
        });
      }

      console.error('Failed to store subscriber details', err);
      return res.status(500).json({ message: 'Failed to store your details. Please try again later.' });
    }

    return res.status(200).json({
      message: 'Subscriber saved.',
      redirectUrl: 'https://dl.bookfunnel.com/hp2x1pfp1p'
    });
  });
});

app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});