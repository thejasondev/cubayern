export default interface Score {
   winner: string | null;
   fullTime: {
     home: number | null;
     away: number | null;
   };
 }