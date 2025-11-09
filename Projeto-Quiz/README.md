Quiz Full Project - Instruções rápidas
- client (React + Vite) porta dev: 5173
- server (Express) porta: 4000

Passos para rodar localmente (recomendado):
1) No terminal A (backend):
   cd server
   npm install
   npm start
   -> se você não conseguir instalar better-sqlite3, o servidor cairá para um armazenamento JSON (db.json) automaticamente e continuará funcionando.

2) No terminal B (frontend):
   cd client
   npm install
   npm run dev
   -> abra http://localhost:5173 e acesse /admin para painel administrativo.

Observações sobre Windows + better-sqlite3:
 - better-sqlite3 contém código nativo e pode exigir Visual C++ Build Tools no Windows.
 - Se tiver problemas, você pode usar WSL (Linux) ou aceitar o fallback JSON (funcionalidade completa, só não usa SQLite).
