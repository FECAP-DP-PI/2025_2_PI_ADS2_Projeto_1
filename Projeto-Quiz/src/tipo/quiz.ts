export type GameState = "Começo" | "Jogando"| "Finalizado";

export interface Perguntitas{
  pergunta: string;
  opções:string[];
  correta:number;
}