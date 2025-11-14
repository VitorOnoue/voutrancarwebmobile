import fs from 'fs';
import path from 'path';

const CSV_PATH = path.resolve(process.cwd(), 'users_plain.csv');

function ensureCsv() {
  if (!fs.existsSync(CSV_PATH)) {
    fs.writeFileSync(CSV_PATH, 'email,password,created_at\n', 'utf-8');
  }
}

function csvSanitize(v) {
  const s = String(v ?? '').replace(/"/g, '""');
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

export async function POST(request) {
  const body = await request.json();
  const { email, password } = body || {};
  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'email and password required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  ensureCsv();
  const line = `"${csvSanitize(String(email).toLowerCase())}","${csvSanitize(
    password,
  )}","${new Date().toISOString()}"\n`;
  try {
    fs.appendFileSync(CSV_PATH, line, 'utf-8');
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('CSV write error:', err);
    return new Response(JSON.stringify({ error: 'write failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET() {
  ensureCsv();
  const csv = fs.readFileSync(CSV_PATH, 'utf-8');
  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="users_plain.csv"',
    },
  });
}
