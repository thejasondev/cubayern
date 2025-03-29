# Cubayern

## Descripción

Cubayern es una iniciativa creada para que la peña del Bayern en Cuba gane presencia online, en respuesta al crecimiento que ha experimentado la comunidad en los últimos años. El objetivo principal es ofrecer un espacio digital donde los aficionados puedan informarse, interactuar y compartir su pasión por el Bayern de manera organizada y profesional.

## Tecnologías

### Front-end
- **Astro:**
- **Tailwind CSS:**

### Back-end (Pendiente)
- Se definirá la tecnología a utilizar, junto con la base de datos, en caso de que se requiera una integración en el futuro.

## Estructura del Proyecto

El diseño de la página web se compondrá de los siguientes elementos:

- **Header:** Contendrá el logo del proyecto y enlaces de navegación. Además de un menú desplegable para dispositivos móviles.
- **Secciones Principales:**
  - **Inicio:** Página principal con información destacada.
  - **Calendario:** Calendario de la temporada donde se muestren los partidos y resultados del equipo.
  - **Noticias:** Sección para mantener informada a la comunidad sobre novedades sobre el club.
  - **Sobre Nosotros:** Información acerca de la iniciativa y su propósito.
  - **Donaciones:** Espacio para recibir contribuciones y apoyar el proyecto.
- **Footer:** Contendrá enlaces adicionales, información de contacto y otros detalles relevantes.

## Instalación

Para ejecutar el proyecto en tu entorno local, sigue estos pasos:

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/thejasondev/cubayern.git

```

## API de Football Data

Este proyecto utiliza la API de [football-data.org](https://www.football-data.org/) para mostrar información sobre partidos, clasificaciones y goleadores. 

### Limitaciones

La versión gratuita de la API tiene limitaciones:
- 10 llamadas por minuto
- Acceso limitado a algunas competiciones
- Información limitada para algunos endpoints


## API de Noticias

Este proyecto también utiliza [The News API](https://www.thenewsapi.com/) para mostrar noticias relacionadas con el Bayern Munich.


### Limitaciones

El plan gratuito incluye:
- 100 solicitudes por día
- Acceso a noticias de los últimos 30 días
- 3 llamadas por segundo