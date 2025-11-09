/*
importar_perguntas.js
Roda no servidor: node importar_perguntas.js
Tenta ler o arquivo TypeScript de perguntas e inserir no banco (sqlite ou json fallback).
*/
const fs = require('fs');
const path = require('path');

const tsPath = path.join(__dirname, '..', 'client', 'src', 'dados', 'perguntas.ts');
let raw = '';
try {
  raw = fs.readFileSync(tsPath, 'utf8');
} catch (e) {
  console.error('arquivo perguntas.ts não encontrado em client/src/dados. Coloque o arquivo lá antes de importar.');
  process.exit(1);
}

// Extract the array between the first '[' and the last ']'
const start = raw.indexOf('[');
const end = raw.lastIndexOf(']');
if (start === -1 || end === -1) {
  console.error('Formato inesperado do arquivo perguntas.ts');
  process.exit(1);
}
const arrText = raw.slice(start, end+1);

// Naive eval after replacing TypeScript-only tokens (like 'export', 'type' etc.)
// This is best-effort; revise manualy if parser fails.
const jsText = arrText.replace(/\\bopções\\b/g, 'opcoes').replace(/\\bpergunta\\b/g, 'pergunta').replace(/\\bcorreta\\b/g, 'correta');
let perguntas = null;
try {
  perguntas = eval(jsText);
} catch (e) {
  console.error('Falha ao interpretar perguntas.ts:', e);
  process.exit(1);
}

// Try to import
let usedSqlite = false;
try {
  const Database = require('better-sqlite3');
  const dbPath = path.join(__dirname, 'quiz.db');
  const db = new Database(dbPath);
  db.prepare(`CREATE TABLE IF NOT EXISTS perguntas (id INTEGER PRIMARY KEY AUTOINCREMENT, pergunta TEXT, opcoes TEXT, correta INTEGER)`).run();
  const insert = db.prepare('INSERT INTO perguntas (pergunta, opcoes, correta) VALUES (?, ?, ?)');
  const t = db.transaction((items) => {
    for (const p of items) insert.run(p.pergunta, JSON.stringify(p.opcoes), p.correta);
  });
  t(perguntas);
  console.log('Importado para SQLite (quiz.db)');
  usedSqlite = true;
} catch (err) {
  console.warn('Não foi possível usar better-sqlite3, importando para db.json. Erro:', err && err.message);
}

if (!usedSqlite) {
  const jsonPath = path.join(__dirname, 'db.json');
  let obj = { perguntas: [], lastId: 0 };
  if (fs.existsSync(jsonPath)) obj = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  for (const p of perguntas) {
    const id = ++obj.lastId;
    obj.perguntas.push({ id, pergunta: p.pergunta, opcoes: p.opcoes, correta: p.correta });
  }
  fs.writeFileSync(jsonPath, JSON.stringify(obj, null, 2));
  console.log('Importado para db.json');
}
