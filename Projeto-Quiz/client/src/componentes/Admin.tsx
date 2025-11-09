import React, {useEffect, useState} from 'react';

export default function Admin(){
  const [perguntas, setPerguntas] = useState([]);
  const [pergunta, setPergunta] = useState('');
  const [opcoes, setOpcoes] = useState(['','','','']);
  const [correta, setCorreta] = useState(0);

  function carregar(){ fetch('/api/perguntas').then(r=>r.json()).then(setPerguntas).catch(()=>setPerguntas([])) }
  useEffect(()=>carregar(),[]);

  async function criar(){
    if(!pergunta.trim()) return alert('Digite a pergunta');
    const res = await fetch('/api/perguntas',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({pergunta, opcoes, correta})});
    if(res.ok){ setPergunta(''); setOpcoes(['','','','']); setCorreta(0); carregar(); }
    else alert('Erro ao criar');
  }
  async function deletar(id){
    if(!confirm('Tem certeza?')) return;
    await fetch(`/api/perguntas/${id}`,{method:'DELETE'});
    carregar();
  }

  return (<div style={{maxWidth:800}}>
    <h1>Painel Admin</h1>
    <div style={{padding:12,border:'1px solid #ddd', borderRadius:8}}>
      <input placeholder='Pergunta' value={pergunta} onChange={e=>setPergunta(e.target.value)} style={{width:'100%',padding:8}}/>
      {opcoes.map((o,i)=>(
        <input key={i} value={o} onChange={e=>{ const c=[...opcoes]; c[i]=e.target.value; setOpcoes(c); }} placeholder={`Opção ${i+1}`} style={{width:'100%',padding:8,marginTop:6}}/>
      ))}
      <div style={{marginTop:6}}>Índice correta: <input type='number' value={correta} onChange={e=>setCorreta(Number(e.target.value))} style={{width:80}}/></div>
      <button onClick={criar} style={{marginTop:8}}>Criar</button>
    </div>

    <h2 style={{marginTop:12}}>Perguntas</h2>
    {perguntas.map(p=>(
      <div key={p.id} style={{padding:8,border:'1px solid #eee', marginTop:6, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>{p.pergunta}</div>
        <div>
          <button onClick={()=>deletar(p.id)} style={{background:'#c00',color:'#fff',border:'none',padding:'6px 10px'}}>Excluir</button>
        </div>
      </div>
    ))}
  </div>)
}
