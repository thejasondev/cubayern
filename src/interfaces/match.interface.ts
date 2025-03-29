import type Competition from "./compitition.interface";
import type Score from "./score.interface";
import type Team from "./team.interface";

export default interface Match {
   id: number;
   utcDate: string;
   status: string;
   matchday: number;
   stage: string;
   group: string | null;
   homeTeam: Team;
   awayTeam: Team;
   score: Score;
   venue: string;
   competition: Competition;
 }