import axios from 'axios';

const footballApi = axios.create({
  baseURL: 'https://api.football-data.org/v4',
  headers: {
    'X-Auth-Token': import.meta.env.PUBLIC_FOOTBALL_API_KEY || '5446bcd190bd459bbdb672fd26543bc9'
  }
});

export async function getBayernMatches() {
  try {
    // ID del equipo del Bayern Munich es 5 (FC Bayern München)
    const response = await footballApi.get('/teams/5/matches');
    return response.data.matches;
  } catch (error) {
    console.error('Error al obtener los partidos del Bayern:', error);
    return [];
  }
}

// Función para obtener los partidos de una competición específica
export async function getCompetitionMatches(competitionCode: string) {
  try {
    const response = await footballApi.get(`/competitions/${competitionCode}/matches`);
    return response.data.matches;
  } catch (error) {
    console.error(`Error al obtener los partidos de ${competitionCode}:`, error);
    return [];
  }
}

// Función para obtener la tabla de posiciones
export async function getStandings(competitionCode: string) {
  try {
    const response = await footballApi.get(`/competitions/${competitionCode}/standings`);
    return response.data.standings[0].table;
  } catch (error) {
    console.error(`Error al obtener la tabla de ${competitionCode}:`, error);
    return [];
  }
}

// Función para obtener máximos goleadores
export async function getScorers(competitionCode: string, limit = 10) {
  try {
    const response = await footballApi.get(`/competitions/${competitionCode}/scorers?limit=${limit}`);
    return response.data.scorers;
  } catch (error) {
    console.error(`Error al obtener los goleadores de ${competitionCode}:`, error);
    return [];
  }
}

export default {
  getBayernMatches,
  getCompetitionMatches,
  getStandings,
  getScorers
}; 