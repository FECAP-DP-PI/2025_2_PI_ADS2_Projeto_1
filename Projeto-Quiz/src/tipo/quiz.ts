export type GameState = "Começo" | "Jogando"| "Finalizado";

export interface Perguntitas{
  id: number;
  pergunta: string;
  opções:string[];
  correta:number;
}