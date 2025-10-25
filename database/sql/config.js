const fs = require('fs');
const path = require('path');
const duckdb = require('duckdb');

const dbPath = path.join(__dirname, 'db.duck');      // Embedded database file
const setupPath = path.join(__dirname, 'setup.sql'); // SQL schema file

// Initialize DuckDB database
const db = new duckdb.Database(dbPath);

function runSetup() {
  if (fs.existsSync(setupPath)) {
    const sql = fs.readFileSync(setupPath, 'utf-8');
    const statements = sql.split(';').map(s => s.trim()).filter(Boolean);

    db.run('BEGIN TRANSACTION;', (err) => {
      if (err) console.error('Begin transaction error:', err);

      statements.forEach(stmt => {
        db.run(stmt, (err2) => {
          if (err2) console.error('Setup statement error:', err2);
        });
      });

      db.run('COMMIT;', (err3) => {
        if (err3) console.error('Commit transaction error:', err3);
        else console.log('setup.sql executed successfully');
      });
    });
  } else {
    console.warn('[setup.sql not found — skipping initialization');
  }
}

runSetup();

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('[DB] Query error:', err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = { query };
