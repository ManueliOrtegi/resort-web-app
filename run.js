const fs = require('fs');
const path = require('path');
const dotenvPath = path.resolve('.env');
if (fs.existsSync(dotenvPath)) {
  const lines = fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    if (line.trim() && !line.trim().startsWith('#')) {
      const index = line.indexOf('=');
      if (index !== -1) {
        process.env[line.substring(0, index).trim()] = line.substring(index + 1).trim();
      }
    }
  }
}
const pool = require('./config/db');
async function run() {
  try {
    console.log('QUERY 1 RESULT:', JSON.stringify(res1.rows));
    const res2 = await pool.query('SELECT id, name, price FROM rooms ORDER BY id');
    console.log('QUERY 2 RESULT:', JSON.stringify(res2.rows));
  } catch (err) { console.error('ERROR:', err.message, err); }
  finally { await pool.end(); }
}
run();
