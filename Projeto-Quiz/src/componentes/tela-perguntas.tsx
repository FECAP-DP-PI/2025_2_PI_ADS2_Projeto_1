
import type { Perguntitas } from '../tipo/quiz'

interface GrupoPerguntas{
    pergunta: Perguntitas;
    seleçãoPergunta: (index: number) => void;
    selectedAnswer:number| null;
    totalPerguntas: number;
    perguntaAtual: number;}

export default function TelaPerguntas({pergunta, selectedAnswer,totalPerguntas,perguntaAtual, seleçãoPergunta}: GrupoPerguntas ){

  const pegaDadosBotão= (index:number): String => {
    if(selectedAnswer === null) return "hover:bg-gray-100";
    if(index === pergunta.correta) return "bg-green-100 border-green 500"
    if ( selectedAnswer=== index) return "bg-red-100 border-red-500";
  }

  return (<div>
    <h2 className="text-x1 font-semibold text-gray-800 mb-2">Pergunta {perguntaAtual + 1 } de {totalPerguntas}</h2>
    <p className="text-gray-600 mb-4">{pergunta.pergunta}</p>
    <div className="space-y-3">
      {pergunta.opções.map((opção, index)=>(
        <button key={index} onClick={() => selectedAnswer === null && seleçãoPergunta(index)} className={`w-full p-4 text-left border rounded-lg ${pegaDadosBotão(index)}`}>
          <div className="flex items-center justify-between">
            <span>{opção}</span>
            
        
          </div>
          </button>
      ) )}
    </div>
  </div>
    
  )
}
