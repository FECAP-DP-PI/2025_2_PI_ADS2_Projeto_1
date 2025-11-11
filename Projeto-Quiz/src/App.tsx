import { useEffect, useState } from "react";
import TelaFinal from "./componentes/tela-final";
import TelaInicial from "./componentes/tela-inicial";
import TelaPerguntas from "./componentes/tela-perguntas";
import GerenciarPerguntas from "./componentes/gerenciar-perguntas";
import type { GameState, Perguntitas } from "./tipo/quiz";

function App() {
  const [gameState, setGameState] = useState<GameState>("Começo");

  const [selectAnswer, setSelectAnswer] = useState<number | null>(null);
  const [perguntaAtual, setPerguntaAtual] = useState<number>(0);
  const [pontosAtual, setPontosAtual] = useState<number>(0);

  const [perguntas, setPerguntas] = useState<Perguntitas[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Carregar perguntas do backend
  useEffect(() => {
    async function carregar() {
      try {
        const resp = await fetch("http://localhost:4000/api/perguntas");
        const dados = await resp.json();
        setPerguntas(dados);
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar perguntas. Verifique se o servidor está rodando.");
      }
      setCarregando(false);
    }
    carregar();
  }, []);

  const handleStart = () => {
    setGameState("Jogando");
    setSelectAnswer(null);
    setPerguntaAtual(0);
    setPontosAtual(0);
  };

  const handleAnswer = (index: number) => {
    setSelectAnswer(index);

    const certa = index === perguntas[perguntaAtual].correta;
    if (certa) {
      setPontosAtual((prev) => prev + 1);
    }

    setTimeout(() => {
      if (perguntaAtual < perguntas.length - 1) {
        setPerguntaAtual((prev) => prev + 1);
        setSelectAnswer(null);
      } else {
        setGameState("Finalizado");
      }
    }, 1500);
  };

  const voltarGerenciar = () => setGameState("Começo");

  if (carregando) {
    return (
      <div className="p-10 text-center text-2xl">
        Carregando perguntas...
      </div>
    );
  }

  if (perguntas.length === 0) {
    return (
      <div className="p-10 text-center text-xl">
        Nenhuma pergunta encontrada no banco.<br />
        Acesse o modo gerenciar para adicionar perguntas.
        <br /><br />
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setGameState("Gerenciar")}
        >
          Gerenciar perguntas
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">

        {gameState === "Começo" && (
          <TelaInicial onStart={handleStart} />
        )}

        {gameState === "Gerenciar" && (
          <GerenciarPerguntas voltar={voltarGerenciar} />
        )}

        {gameState === "Jogando" && (
          <div className="p-8">
            <TelaPerguntas
              pergunta={perguntas[perguntaAtual]}
              seleçãoPergunta={handleAnswer}
              selectedAnswer={selectAnswer}
              totalPerguntas={perguntas.length}
              perguntaAtual={perguntaAtual}
            />

            <div className="mt-6 text-center text-gray-600">
              Pontos: {pontosAtual}/{perguntas.length}
            </div>
          </div>
        )}

        {gameState === "Finalizado" && (
          <TelaFinal
            pontosAtual={pontosAtual}
            totalPerguntas={perguntas.length}
            Recomeço={handleStart}
          />
        )}

      </div>
    </div>
  );
}

export default App;
