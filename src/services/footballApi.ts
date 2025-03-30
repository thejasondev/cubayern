import axios from 'axios';
import type Match from '../interfaces/match.interface';

const footballApi = axios.create({
  baseURL: 'https://api.football-data.org/v4',
  headers: {
    'X-Auth-Token': import.meta.env.PUBLIC_FOOTBALL_API_KEY || '5446bcd190bd459bbdb672fd26543bc9'
  }
});

export async function getBayernMatches() {
  try {
    // ID del equipo del Bayern Munich es 5 (FC Bayern München)
    // Obtener todos los partidos (SCHEDULED, LIVE, FINISHED)
    const response = await footballApi.get('/teams/5/matches');
    
    if (!response.data || !response.data.matches) {
      console.error('No se encontraron partidos para el Bayern Munich');
      return [];
    }
    
    // Si no hay partidos SCHEDULED, probar con ID alternativo 27 (Bayern Munich)
    if (!response.data.matches.some((match: Match) => match.status === 'SCHEDULED')) {
      try {
        const altResponse = await footballApi.get('/teams/27/matches');
        if (altResponse.data && altResponse.data.matches) {
          return altResponse.data.matches;
        }
      } catch (altError) {
        console.error('Error al intentar con ID alternativo:', altError);
      }
    }
    
    return response.data.matches;
  } catch (error) {
    console.error('Error al obtener los partidos del Bayern:', error);
    
    // Intenta con un ID alternativo como respaldo
    try {
      const altResponse = await footballApi.get('/teams/27/matches');
      return altResponse.data.matches;
    } catch (altError) {
      console.error('Error también con ID alternativo:', altError);
      return [];
    }
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