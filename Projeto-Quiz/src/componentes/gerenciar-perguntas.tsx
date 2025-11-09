import { useEffect, useState } from "react";

type Pergunta = {
  id?: number;
  pergunta: string;
  opcoes: string[];
  correta: number;
};

export default function GerenciarPerguntas({ voltar }: { voltar: () => void }) {
  const [lista, setLista] = useState<Pergunta[]>([]);
  const [editing, setEditing] = useState<Pergunta | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchPerguntas() {
    setLoading(true);
    try {
      const res = await fetch("/api/perguntas");
      const data = await res.json();
      setLista(data);
    } catch (e) {
      console.error(e);
      alert("Erro ao buscar perguntas. Certifique-se que o servidor está rodando.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPerguntas();
  }, []);

  function startNew() {
    setEditing({ pergunta: "", opcoes: ["", ""], correta: 0 });
  }

  function edit(item: Pergunta) {
    setEditing({ ...item });
  }

  async function save(p: Pergunta) {
    if (!p.pergunta || !Array.isArray(p.opcoes)) return alert("Preencha corretamente");
    if (p.id) {
      const res = await fetch(`/api/perguntas/${p.id}`, { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify(p) });
      if (!res.ok) return alert("Erro ao atualizar");
    } else {
      const res = await fetch("/api/perguntas", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(p) });
      if (!res.ok) return alert("Erro ao criar");
    }
    setEditing(null);
    fetchPerguntas();
  }

  async function remove(id?: number) {
    if (!id) return;
    if (!confirm("Deseja excluir esta pergunta?")) return;
    const res = await fetch(`/api/perguntas/${id}`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) return alert("Erro ao excluir");
    fetchPerguntas();
  }

  return (
    <div style={{padding:20}}>
      <h2>Gerenciar Perguntas</h2>
      <button onClick={voltar}>Voltar</button>
      <button onClick={startNew} style={{marginLeft:10}}>Nova pergunta</button>
      {loading ? <p>Carregando...</p> : (
        <table style={{width:"100%", marginTop:10}}>
          <thead><tr><th>ID</th><th>Pergunta</th><th>Opções</th><th>Correta</th><th>Ações</th></tr></thead>
          <tbody>
            {lista.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.pergunta}</td>
                <td>{item.opcoes.join(" | ")}</td>
                <td>{item.correta}</td>
                <td>
                  <button onClick={() => edit(item)}>Editar</button>
                  <button onClick={() => remove(item.id)} style={{marginLeft:6}}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing && (
        <div style={{marginTop:20, border:"1px solid #ccc", padding:10}}>
          <h3>{editing.id ? "Editar" : "Nova"}</h3>
          <div>
            <label>Pergunta:</label><br/>
            <input value={editing.pergunta} onChange={e => setEditing({...editing, pergunta: e.target.value})} style={{width:"100%"}} />
          </div>
          <div style={{marginTop:8}}>
            <label>Opções (uma por linha):</label><br/>
            <textarea value={editing.opcoes.join("\n")} onChange={e => setEditing({...editing, opcoes: e.target.value.split("\\n")})} rows={6} style={{width:"100%"}} />
          </div>
          <div style={{marginTop:8}}>
            <label>Índice da resposta correta (0-based):</label><br/>
            <input type="number" value={editing.correta} onChange={e => setEditing({...editing, correta: Number(e.target.value)})} />
          </div>
          <div style={{marginTop:8}}>
            <button onClick={() => save(editing)}>Salvar</button>
            <button onClick={() => setEditing(null)} style={{marginLeft:8}}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}