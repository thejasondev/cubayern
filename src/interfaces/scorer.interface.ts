import type Team from "./team.interface";

export default interface Scorer {
  player: {
    id: number;
    name: string;
    nationality: string;
  };
  team: Team;
  goals: number;
  assists: number;
}