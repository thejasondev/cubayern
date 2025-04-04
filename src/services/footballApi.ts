import axios from 'axios';
import type Match from '../interfaces/match.interface';


// Determinar si estamos en el navegador o en el servidor
const isBrowser = typeof window !== 'undefined';

// Crear instancia de Axios con la configuración básica
const footballApi = axios.create({
  // En el servidor usamos la URL completa, en el cliente usamos el proxy
  baseURL: isBrowser ? '/api/football' : 'https://api.football-data.org/v4',
  headers: isBrowser 
    ? {} // En el cliente el proxy agrega los headers
    : { 'X-Auth-Token': import.meta.env.PUBLIC_FOOTBALL_API_KEY || '5446bcd190bd459bbdb672fd26543bc9' }
});

// Función para esperar un tiempo específico en ms
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getBayernMatches() {
  try {
    console.log('Intentando obtener partidos con ID 5...');
    console.log('Intentando obtener partidos con ID 5...');
    // ID del equipo del Bayern Munich es 5 (FC Bayern München)
    // Obtener todos los partidos (SCHEDULED, LIVE, FINISHED)
    const response = await footballApi.get('/teams/5/matches');
    
    if (response.data && response.data.matches && response.data.matches.length > 0) {
      console.log(`Obtenidos ${response.data.matches.length} partidos del Bayern.`);

      // Si no hay partidos SCHEDULED, probar con ID alternativo
      if (!response.data.matches.some((match: Match) => match.status === 'SCHEDULED')) {
        console.log('No hay partidos programados con ID 5, probando con ID alternativo...');
        try {
          // Esperar 1 segundo para evitar exceder límites de rate
          await wait(1000);
          const altResponse = await footballApi.get('/teams/27/matches');
          if (altResponse.data && altResponse.data.matches && altResponse.data.matches.length > 0) {
            console.log(`Obtenidos ${altResponse.data.matches.length} partidos con ID alternativo.`);
            return altResponse.data.matches;
          }
        } catch (altError) {
          console.error('Error al intentar con ID alternativo:', altError);
        }
      }
      
      return response.data.matches;
    } else {
      console.error('No se encontraron partidos para el Bayern Munich con ID 5');
      
      // Esperar 1 segundo antes de intentar con ID alternativo
      await wait(1000);
      
      try {
        console.log('Intentando obtener partidos con ID alternativo 27...');
        const altResponse = await footballApi.get('/teams/27/matches');
        if (altResponse.data && altResponse.data.matches && altResponse.data.matches.length > 0) {
          console.log(`Obtenidos ${altResponse.data.matches.length} partidos con ID alternativo.`);
          return altResponse.data.matches;
        } else {
          console.error('No se encontraron partidos con ID alternativo');
          return [];
        }
      } catch (altError) {
        console.error('Error al intentar con ID alternativo:', altError);
        return [];
      }
    }
    if (response.data && response.data.matches && response.data.matches.length > 0) {
      console.log(`Obtenidos ${response.data.matches.length} partidos del Bayern.`);

      // Si no hay partidos SCHEDULED, probar con ID alternativo
      if (!response.data.matches.some((match: Match) => match.status === 'SCHEDULED')) {
        console.log('No hay partidos programados con ID 5, probando con ID alternativo...');
        try {
          // Esperar 1 segundo para evitar exceder límites de rate
          await wait(1000);
          const altResponse = await footballApi.get('/teams/27/matches');
          if (altResponse.data && altResponse.data.matches && altResponse.data.matches.length > 0) {
            console.log(`Obtenidos ${altResponse.data.matches.length} partidos con ID alternativo.`);
            return altResponse.data.matches;
          }
        } catch (altError) {
          console.error('Error al intentar con ID alternativo:', altError);
        }
      }
      
      return response.data.matches;
    } else {
      console.error('No se encontraron partidos para el Bayern Munich con ID 5');
      
      // Esperar 1 segundo antes de intentar con ID alternativo
      await wait(1000);
      
      try {
        console.log('Intentando obtener partidos con ID alternativo 27...');
        const altResponse = await footballApi.get('/teams/27/matches');
        if (altResponse.data && altResponse.data.matches && altResponse.data.matches.length > 0) {
          console.log(`Obtenidos ${altResponse.data.matches.length} partidos con ID alternativo.`);
          return altResponse.data.matches;
        } else {
          console.error('No se encontraron partidos con ID alternativo');
          return [];
        }
      } catch (altError) {
        console.error('Error al intentar con ID alternativo:', altError);
        return [];
      }
    }
  } catch (error) {
    console.error('Error al obtener los partidos del Bayern con ID 5:', error);
    
    // Esperar 1 segundo antes de intentar con ID alternativo
    await wait(1000);
    console.error('Error al obtener los partidos del Bayern con ID 5:', error);
    
    // Esperar 1 segundo antes de intentar con ID alternativo
    await wait(1000);
    
    try {
      console.log('Intentando recuperación con ID alternativo 27...');
      console.log('Intentando recuperación con ID alternativo 27...');
      const altResponse = await footballApi.get('/teams/27/matches');
      if (altResponse.data && altResponse.data.matches) {
        console.log(`Recuperación exitosa. Obtenidos ${altResponse.data.matches.length} partidos.`);
        return altResponse.data.matches;
      } else {
        console.error('Recuperación fallida. No se encontraron datos.');
        return [];
      }
      if (altResponse.data && altResponse.data.matches) {
        console.log(`Recuperación exitosa. Obtenidos ${altResponse.data.matches.length} partidos.`);
        return altResponse.data.matches;
      } else {
        console.error('Recuperación fallida. No se encontraron datos.');
        return [];
      }
    } catch (altError) {
      console.error('Error también con ID alternativo:', altError);
      
      // Intento final con un ID alternativo adicional (FC Bayern)
      try {
        await wait(1000);
        console.log('Intento final con ID 157...');
        const finalResponse = await footballApi.get('/teams/157/matches');
        if (finalResponse.data && finalResponse.data.matches) {
          return finalResponse.data.matches;
        }
      } catch (finalError) {
        console.error('Todos los intentos fallaron:', finalError);
      }
      
      
      // Intento final con un ID alternativo adicional (FC Bayern)
      try {
        await wait(1000);
        console.log('Intento final con ID 157...');
        const finalResponse = await footballApi.get('/teams/157/matches');
        if (finalResponse.data && finalResponse.data.matches) {
          return finalResponse.data.matches;
        }
      } catch (finalError) {
        console.error('Todos los intentos fallaron:', finalError);
      }
      
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