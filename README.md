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

Este proyecto utiliza cinco APIs diferentes para obtener noticias del Bayern Munich, lo que proporciona una mayor diversidad de fuentes y más robustez ante fallos o límites diarios:

### 1. NewsAPI

[NewsAPI](https://newsapi.org/) proporciona noticias de múltiples fuentes internacionales.


#### Limitaciones de NewsAPI:
- 100 solicitudes por día
- Sin acceso a noticias históricas (solo noticias de los últimos 30 días)
- Limitado a entornos de desarrollo, no se puede usar en producción

### 2. TheNewsAPI

[TheNewsAPI](https://www.thenewsapi.com/) es una API alternativa con diferentes fuentes de noticias.

#### Limitaciones de TheNewsAPI:
- 100 solicitudes por día en el plan gratuito
- Acceso a noticias de los últimos 30 días
- 3 llamadas por segundo

### 3. GNews API

[GNews](https://gnews.io/) ofrece noticias de múltiples fuentes en más de 22 idiomas y 30 países.

#### Limitaciones de GNews:
- 100 solicitudes por día en el plan gratuito
- Hasta 10 artículos por solicitud
- Máximo 1 solicitud por segundo

### 4. Currents API

[Currents API](https://currentsapi.services/) proporciona acceso a noticias de 70 países en 18 idiomas diferentes.


#### Limitaciones de Currents API:
- Límite diario de solicitudes (varía según el plan)
- Soporta CORS, ideal para aplicaciones web
- Ofrece noticias con contenido completo

### 5. NewsData.io API

[NewsData.io](https://newsdata.io/) permite buscar noticias tanto actuales como históricas de más de 83,000 fuentes.


#### Limitaciones de NewsData.io:
- 200 solicitudes diarias en el plan gratuito
- Acceso a noticias históricas de hasta 6 años
- Disponible en más de 89 idiomas

## Estrategia de recuperación ante fallos

El servicio de noticias está diseñado para seguir funcionando incluso cuando algunas APIs alcanzan su límite o fallan:

1. Todas las solicitudes se realizan en paralelo para mejorar el rendimiento
2. Si una API falla o su clave no está configurada, las demás seguirán proporcionando noticias
3. Los resultados se combinan y se eliminan duplicados para evitar mostrar la misma noticia varias veces
4. Las solicitudes se distribuyen entre todas las APIs para maximizar el número total de solicitudes diarias

## Problemas conocidos y soluciones

### No se muestran partidos programados

Si no ves partidos programados en la previsualización del calendario:

1. Verifica que tu API key de football-data.org sea válida
2. La API puede no tener partidos programados para el Bayern en el futuro próximo
3. El componente mostrará automáticamente partidos de ejemplo cuando no hay datos reales

### Límites de API superados

Si recibes errores relacionados con límites de API:

1. Para NewsAPI: Limita el número de solicitudes o considera actualizar a un plan de pago
2. Para football-data.org: Implementa almacenamiento en caché o espera a que se reinicie el límite