import {Play } from "lucide-react";

interface StartScreenProps { 
    onStart: () => void;
}


export default function TelaInicial({onStart} : StartScreenProps) {
  return (
    <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Quiz Reciclagem
        </h1>
        <p className="text-gray-600 mb-8"> Teste seu Conhecimento Reciclagem </p>
        <button onClick={onStart} className="inline-flex items-center px-6 py-3 bg-blue-600 text-white-600">
        <Play className="w-5 h-5 mr-2"/>
            Comece o Quiz 
        </button>
    </div>
  )
}
