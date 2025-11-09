import React, {useEffect, useState} from 'react';

export default function Home(){
  const [perguntas, setPerguntas] = useState([]);
  useEffect(()=>{ fetch('/api/perguntas').then(r=>r.json()).then(setPerguntas).catch(()=>setPerguntas([])) },[]);
  return (<div>
    <h1>Quiz</h1>
    <p>Quantidade de perguntas: {perguntas.length}</p>
  </div>)
}
