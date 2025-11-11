
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

let useSqlite = false;
let db = null;
let sqliteDB = null;

try {
  const Database = require('better-sqlite3');
  const dbPath = path.join(__dirname, 'quiz.db');
  sqliteDB = new Database(dbPath);
  sqliteDB.prepare(`CREATE TABLE IF NOT EXISTS perguntas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pergunta TEXT NOT NULL,
    opcoes TEXT NOT NULL,
    correta INTEGER NOT NULL
  )`).run();
  useSqlite = true;
  console.log('Usando better-sqlite3 para persistência (quiz.db)');
} catch (err) {
  console.warn('better-sqlite3 não disponível. Usando fallback JSON. Erro:', err && err.message);
  const jsonPath = path.join(__dirname, 'db.json');
  if (!fs.existsSync(jsonPath)) fs.writeFileSync(jsonPath, JSON.stringify({perguntas:[], lastId:0}, null, 2));
  db = { jsonPath };
}

function readJson() {
  return JSON.parse(fs.readFileSync(db.jsonPath, 'utf-8'));
}
function writeJson(obj) {
  fs.writeFileSync(db.jsonPath, JSON.stringify(obj, null, 2));
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API
app.get('/api/perguntas', (req, res) => {
  if (useSqlite) {
    const rows = sqliteDB.prepare('SELECT * FROM perguntas ORDER BY id').all();
    const data = rows.map(r => ({...r, opcoes: JSON.parse(r.opcoes)}));
    return res.json(data);
  } else {
    const obj = readJson();
    return res.json(obj.perguntas);
  }
});

app.get('/api/perguntas/:id', (req, res) => {
  const id = Number(req.params.id);
  if (useSqlite) {
    const row = sqliteDB.prepare('SELECT * FROM perguntas WHERE id = ?').get(id);
    if (!row) return res.status(404).json({error:'not found'});
    row.opcoes = JSON.parse(row.opcoes);
    return res.json(row);
  } else {
    const obj = readJson();
    const item = obj.perguntas.find(p => p.id === id);
    if (!item) return res.status(404).json({error:'not found'});
    return res.json(item);
  }
});

app.post('/api/perguntas', (req, res) => {
  const {pergunta, opcoes, correta} = req.body;
  if (!pergunta || !Array.isArray(opcoes) || typeof correta !== 'number') return res.status(400).json({error:'invalid'});
  if (useSqlite) {
    const stmt = sqliteDB.prepare('INSERT INTO perguntas (pergunta, opcoes, correta) VALUES (?, ?, ?)');
    const info = stmt.run(pergunta, JSON.stringify(opcoes), correta);
    const row = sqliteDB.prepare('SELECT * FROM perguntas WHERE id = ?').get(info.lastInsertRowid);
    row.opcoes = JSON.parse(row.opcoes);
    return res.status(201).json(row);
  } else {
    const obj = readJson();
    const id = ++obj.lastId;
    const item = { id, pergunta, opcoes, correta };
    obj.perguntas.push(item);
    writeJson(obj);
    return res.status(201).json(item);
  }
});

app.put('/api/perguntas/:id', (req, res) => {
  const id = Number(req.params.id);
  const {pergunta, opcoes, correta} = req.body;
  if (useSqlite) {
    const existing = sqliteDB.prepare('SELECT * FROM perguntas WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({error:'not found'});
    sqliteDB.prepare('UPDATE perguntas SET pergunta = ?, opcoes = ?, correta = ? WHERE id = ?').run(pergunta, JSON.stringify(opcoes), correta, id);
    const row = sqliteDB.prepare('SELECT * FROM perguntas WHERE id = ?').get(id);
    row.opcoes = JSON.parse(row.opcoes);
    return res.json(row);
  } else {
    const obj = readJson();
    const idx = obj.perguntas.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({error:'not found'});
    obj.perguntas[idx] = { id, pergunta, opcoes, correta };
    writeJson(obj);
    return res.json(obj.perguntas[idx]);
  }
});

app.delete('/api/perguntas/:id', (req, res) => {
  const id = Number(req.params.id);
  if (useSqlite) {
    sqliteDB.prepare('DELETE FROM perguntas WHERE id = ?').run(id);
    return res.status(204).send();
  } else {
    const obj = readJson();
    const before = obj.perguntas.length;
    obj.perguntas = obj.perguntas.filter(p => p.id !== id);
    writeJson(obj);
    if (obj.perguntas.length === before) return res.status(404).json({error:'not found'});
    return res.status(204).send();
  }
});


const frontendDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => res.sendFile(path.join(frontendDist, 'index.html')));
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on', PORT));
