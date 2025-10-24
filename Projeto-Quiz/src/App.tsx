import { use, useState } from "react"
import TelaFinal from "./componentes/tela-final"
import TelaInicial from "./componentes/tela-inicial"
import TelaPerguntas from "./componentes/tela-perguntas"
import type { GameState } from "./tipo/quiz"
import { PERGUNTAS } from "./dados/perguntas"

function App() {
  const [gameState, setGameState] = useState<GameState>("Começo");
  const[selectAnswer, setSelectAnswer] = useState<number | null>(null);
  const[perguntaAtual,setPerguntaAtua] = useState<number>(0);
  const[pontosAtual, setPontosAtual] = useState<number>(0);
const handleStart = () => {
  setGameState("Jogando");
  setPontosAtual(0);
}
const handleAnswer =(index: number): void  =>{
  setSelectAnswer(index);
  const estaCerto =index ===PERGUNTAS[perguntaAtual].correta;
  if(estaCerto){
    setPontosAtual((prev) => prev +1);

  }
  setTimeout(() => {
    if(perguntaAtual < PERGUNTAS.length -1){
    setPerguntaAtua((prev) => prev +1 );
  
  setSelectAnswer(null);} else{
    setGameState("Finalizado");
  }
  }, 1500);
}

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w">
      {gameState === "Começo" && <TelaInicial onStart={handleStart}/>}

      {gameState==="Jogando" && (
        <div className="p-8">
        <TelaPerguntas pergunta={PERGUNTAS[perguntaAtual]} 
        seleçãoPergunta={handleAnswer}
        selectedAnswer={selectAnswer}
        totalPerguntas={PERGUNTAS.length}
        perguntaAtual={perguntaAtual}/> 
        <div className="mt-6 text-center text-gray-600">Pontos: {pontosAtual}/{PERGUNTAS.length}</div>
        </div>)}


      {gameState=== "Finalizado" && <TelaFinal pontosAtual={pontosAtual} totalPerguntas={PERGUNTAS.length} Recomeço={handleStart}/>}</div>
      
    </div> 
  )
}

export default App
