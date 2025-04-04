import { useEffect, useState } from "react";
import type Match from "../../interfaces/match.interface";
import { getBayernMatches } from "../../services/footballApi";

function formatShortDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  } catch (error) {
    console.error("Error al formatear fecha:", dateString, error);
    return "Fecha inválida";
  }
}


function formatTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error("Error al formatear hora:", dateString, error);
    return "Hora inválida";
  }
}

const ReactMatchPreview = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: number | undefined;

    const fetchData = async () => {
      try {
        console.log("Iniciando búsqueda de partidos...");
        const allMatches = await getBayernMatches();
        console.log("Partidos recibidos:", allMatches?.length || 0);
        
        if (!isMounted) return;

        if (!allMatches || allMatches.length === 0) {
          console.log("No hay partidos disponibles de la API");
          setError("No se pudieron cargar los datos de los próximos partidos.");
          setApiError(true);
          setLoading(false);
          return;
        }

        // Filtrar solo los partidos programados (SCHEDULED o TIMED) y ordenar por fecha
        const scheduledMatches = allMatches
          .filter((match: Match) => ['SCHEDULED', 'TIMED'].includes(match.status))
          .sort((a: Match, b: Match) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
          .slice(0, 3); // Obtener solo los próximos 3 partidos
        
        console.log("Partidos filtrados:", scheduledMatches.length);

        if (scheduledMatches.length === 0) {
          console.log("No hay partidos programados");
          setError("No hay próximos partidos programados disponibles.");
          setApiError(true);
        } else {
          setMatches(scheduledMatches);
          setError(null);
          setApiError(false);
          // Limpiar cualquier timeout existente ya que los datos se cargaron correctamente
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        }
      } catch (err) {
        console.error("Error al obtener partidos:", err);
        if (isMounted) {
          console.log("Error al cargar partidos");
          setError("Ocurrió un error al cargar los datos de los partidos.");
          setApiError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Timeout para evitar carga infinita
    timeoutId = window.setTimeout(() => {
      if (isMounted && loading) {
        setLoading(false);
        if (matches.length === 0) {
          setError("Tiempo de espera agotado al intentar cargar los datos de los partidos.");
          setApiError(true);
        }
      }
    }, 5000); // Aumentamos el tiempo a 5 segundos para dar más margen

    // Limpieza para evitar actualizar estado en componente desmontado
    return () => { 
      isMounted = false; 
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (loading) {
    return (
      <section className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Próximos Partidos</h2>
          <a href="/calendario" className="text-xs font-medium text-bayern-red hover:underline">
            Ver calendario
          </a>
        </div>
        <div className="flex justify-center items-center py-4">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-bayern-red border-r-transparent"></div>
          <span className="ml-2 text-sm text-gray-500">Cargando...</span>
        </div>
      </section>
    );
  }

  // Si hay un error de API y no hay partidos disponibles, mostrar mensaje
  if (apiError && matches.length === 0) {
    return (
      <section className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Próximos Partidos</h2>
          <a href="/calendario" className="text-xs font-medium text-bayern-red hover:underline">
            Ver calendario
          </a>
        </div>
        <div className="rounded-md border border-gray-200 p-3 text-center">
          <p className="text-sm text-gray-500">{error || "No hay próximos partidos programados."}</p>
          <p className="mt-2 text-xs text-gray-400">Visita la página del calendario para más información.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Próximos Partidos</h2>
        <a href="/calendario" className="text-xs font-medium text-bayern-red hover:underline">
          Ver calendario
        </a>
      </div>

      {/* Mostrar mensaje de advertencia si hubo algún error pero tenemos partidos para mostrar */}
      {error && matches.length > 0 && (
        <div className="mb-3 px-2 py-1 text-xs text-yellow-700 bg-yellow-50 rounded-md">
          Nota: Se produjo un error al cargar todos los datos. Mostrando partidos disponibles.
        </div>
      )}

      {matches.length === 0 ? (
        <div className="rounded-md border border-gray-200 p-3 text-center">
          <p className="text-sm text-gray-500">No hay próximos partidos programados.</p>
          <p className="mt-2 text-xs text-gray-400">Visita la página del calendario para más información.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match, index) => {
            // Obtener la sede del partido
            const venue = match.venue || (match.homeTeam.name.includes("Bayern") ? 'Allianz Arena' : 'Visitante');
            
            return (
              <div
                key={match.id}
                className={`
                  rounded-md border border-gray-200 p-3 transition-all
                  ${index === 0 ? 'block' : ''}
                  ${index === 1 ? 'hidden md:block' : ''}
                  ${index === 2 ? 'hidden lg:block' : ''}
                `}
              >
                <div className="text-xs font-medium text-gray-500">{match.competition.name}</div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <div className="font-medium text-sm truncate text-right flex-1">
                    {match.homeTeam.name.includes("Bayern") ? (
                      <span className="font-bold text-bayern-red">{match.homeTeam.shortName || match.homeTeam.name}</span>
                    ) : (
                      match.homeTeam.shortName || match.homeTeam.name
                    )}
                  </div>
                  <div className="text-xs font-bold text-gray-400">VS</div>
                  <div className="font-medium text-sm truncate text-left flex-1">
                    {match.awayTeam.name.includes("Bayern") ? (
                      <span className="font-bold text-bayern-red">{match.awayTeam.shortName || match.awayTeam.name}</span>
                    ) : (
                      match.awayTeam.shortName || match.awayTeam.name
                    )}
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500 flex-wrap gap-x-2 gap-y-1">
                  <div>
                    <span className="font-medium text-gray-700">Fecha:</span> {formatShortDate(match.utcDate)}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Hora:</span> {formatTime(match.utcDate)}
                  </div>
                  <div className="truncate">
                    <span className="font-medium text-gray-700">Lugar:</span> {venue}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ReactMatchPreview;  