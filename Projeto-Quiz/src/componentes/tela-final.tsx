import { Trophy } from "lucide-react"
 interface ItensTelaFinal {
    Recomeço: () => void;
    pontosAtual:number;
    totalPerguntas:number;
  }
export default function TelaFinal({Recomeço, pontosAtual, totalPerguntas}: ItensTelaFinal) {
  
 const porcetagem= Math.round((pontosAtual/totalPerguntas)*100);
  return (
    <div className="p-8 text-center">
      <Trophy className ="w-16 h-16 mx-auto text-yellow-500 mb-4"/>
      <h2 className="text-2xl font-bold text-gray-800 mb-4"> Fim do juego</h2>
      <p className="text-lg text-gray-600"> Pontuação final: {pontosAtual}/{totalPerguntas}</p>
      <p className="mt-2 text-gray-600">({porcetagem}%  de acertos)</p>
      <button onClick={Recomeço}
      className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700
      transition-colors="> Jogue novamente</button>
    </div>
  )
}
