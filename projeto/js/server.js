
/**
 * server.js — Backend mínimo para registrar credenciais em CSV (sem SQL)
 * Rodar:
 *   npm init -y
 *   npm i express cors
 *   node server.js
 */
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const CSV_PATH = path.resolve(__dirname, 'users_plain.csv');

app.use(cors());
app.use(express.json());

function ensureCsv() {
  if (!fs.existsSync(CSV_PATH)) {
    fs.writeFileSync(CSV_PATH, 'email,password,created_at\n', 'utf-8');
  }
}
function csvSanitize(v){
  const s = String(v ?? '').replace(/"/g,'""');
  // Evita "CSV formula injection" em planilhas
  return (/^[=+\-@]/.test(s) ? "'" + s : s);
}

app.post('/api/csv/register', (req, res) => {
  const { email, password } = req.body || {};
  if(!email || !password){
    return res.status(400).json({ error: 'email and password required' });
  }
  ensureCsv();
  const line = `"${csvSanitize(String(email).toLowerCase())}","${csvSanitize(password)}","${new Date().toISOString()}"\n`;
  fs.appendFile(CSV_PATH, line, (err) => {
    if (err) {
      console.error('CSV write error:', err);
      return res.status(500).json({ error: 'write failed' });
    }
    res.json({ ok: true });
  });
});

app.get('/api/users.csv', (req, res) => {
  ensureCsv();
  res.sendFile(CSV_PATH);
});

app.listen(PORT, () => {
  console.log(`CSV API online: http://localhost:${PORT}`);
  console.log(`Arquivo: ${CSV_PATH}`);
});
