# ⚽ FIFA World Cup 2026™ Calendar Generator

> **Genera archivos `.ics` con cumplimiento RFC5545 para los 104 partidos de la Copa del Mundo FIFA 2026, utilizando datos oficiales en tiempo real desde la API de FIFA.**

Obtiene automáticamente horarios de partidos desde `api.fifa.com`, genera calendarios suscribibles con manejo correcto de zonas horarias, emojis de banderas, información de estadios y recordatorios pre-partido. Compatible con **Google Calendar**, **Apple Calendar**, **Outlook** y cualquier cliente RFC5545.

---

## 🌎 Resumen del Torneo

| Detalle | Información |
|---------|-------------|
| **Fechas** | 11 de junio – 19 de julio, 2026 |
| **Países Anfitriones** | 🇲🇽 México · 🇺🇸 Estados Unidos · 🇨🇦 Canadá |
| **Equipos** | 48 |
| **Grupos** | 12 (A–L) |
| **Total de Partidos** | 104 |
| **Sedes** | 16 estadios |

---

## 📡 Fuente de Datos

**Todas las fechas, horarios de inicio, sedes y equipos provienen de la API oficial de FIFA.**

```
GET https://api.fifa.com/api/v3/calendar/matches
  ?idCompetition=17
  &idSeason=285023
  &count=200
  &language=en
```

El proyecto **nunca** utiliza horarios codificados manualmente. Cada ejecución de `pnpm fetch-data` obtiene datos frescos directamente de los servidores de FIFA, asegurando exactitud absoluta con el calendario publicado en `fifa.com`.

| Campo API | Uso |
|-----------|-----|
| `Date` | Hora de inicio UTC |
| `LocalDate` | Hora de inicio local del estadio |
| `Stadium.Name` / `Stadium.CityName` | Sede y ciudad |
| `Home` / `Away` | Equipos y abreviaturas |
| `GroupName` / `StageName` | Fase del torneo |
| `MatchNumber` | Número oficial de partido |
| `PlaceHolderA` / `PlaceHolderB` | Posiciones de eliminatorias |

---

## 📅 Tipos de Calendarios Generados

| Calendario | Archivo | Descripción |
|------------|---------|-------------|
| **Torneo Completo** | `full-worldcup-2026.ics` | Los 104 partidos |
| **Fase Eliminatoria** | `knockout-stage.ics` | R32 + R16 + QF + SF + Final |
| **Por Grupo** | `groups/group-a.ics` … | 6 partidos por grupo |
| **Por Equipo** | `teams/mexico.ics` … | Fase de grupos por equipo |
| **Por Estadio** | `stadiums/metlife-stadium.ics` … | Todos los partidos por sede |
| **Por País Anfitrión** | `hosts/united-states.ics` … | Partidos por país anfitrión |
| **Por Ronda** | `knockout/round-of-32.ics` … | Cada ronda de eliminación individual |

**Total: 87 archivos `.ics`** — incluyendo 12 grupos, 48 equipos, 16 estadios, 3 países, 7 rondas.

---

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 20+
- pnpm 9+

### Instalación

```bash
git clone https://github.com/yourusername/worldcup-2026-calendar.git
cd worldcup-2026-calendar
pnpm install
```

### Flujo Completo

```bash
# 1. Obtener datos oficiales de la API de FIFA
pnpm fetch-data

# 2. Validar contra la API en vivo
pnpm validate:live

# 3. Generar todos los calendarios
pnpm generate
```

### Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm fetch-data` | Obtiene los 104 partidos desde `api.fifa.com` y actualiza `matches.json` |
| `pnpm validate` | Valida integridad de datos locales (conteos, fechas, zonas horarias) |
| `pnpm validate:live` | Valida datos locales **contra la API de FIFA en vivo** |
| `pnpm generate` | Genera los 87 archivos `.ics` |
| `pnpm generate:teams` | Solo calendarios por equipo |
| `pnpm generate:groups` | Solo calendarios por grupo |
| `pnpm generate:knockout` | Solo calendarios de eliminatorias |
| `pnpm update-data` | Obtiene datos de FIFA y actualiza `matches.json` (usado por CI/CD) |
| `pnpm typecheck` | Verificación de tipos TypeScript |
| `pnpm lint` | Lint con ESLint |
| `pnpm format` | Formateo con Prettier |
| `pnpm clean` | Limpia directorios `dist/` y `output/` |

### Estructura de Salida

```
output/
├── full-worldcup-2026.ics          # Torneo completo (104 partidos)
├── knockout-stage.ics              # Todas las eliminatorias (32 partidos)
├── groups/
│   ├── group-a.ics … group-l.ics   # 12 grupos × 6 partidos
├── teams/
│   ├── mexico.ics                  # 48 equipos × 3 partidos
│   ├── brazil.ics
│   └── ...
├── stadiums/
│   ├── estadio-azteca.ics          # 16 estadios
│   ├── metlife-stadium.ics
│   └── ...
├── hosts/
│   ├── mexico.ics                  # 3 países anfitriones
│   ├── united-states.ics
│   └── canada.ics
└── knockout/
    ├── round-of-32.ics             # 7 rondas individuales
    ├── round-of-16.ics
    ├── quarter-final.ics
    ├── semi-final.ics
    ├── third-place-match.ics
    └── final.ics
```

---

## 📲 Importar Calendarios

### Google Calendar

1. Ir a [Configuración de Google Calendar](https://calendar.google.com/calendar/r/settings/addcalendar)
2. Clic en **"Desde URL"** en la barra lateral
3. Pegar la URL del archivo `.ics`:
   ```
   https://yourusername.github.io/worldcup-2026-calendar/full-worldcup-2026.ics
   ```
4. Clic en **"Agregar calendario"**

> **URL de suscripción (auto-actualizable):**
> ```
> webcal://yourusername.github.io/worldcup-2026-calendar/full-worldcup-2026.ics
> ```

### Apple Calendar (macOS / iOS)

**macOS:**
1. Abrir la app Calendario
2. Archivo → Nueva Suscripción de Calendario…
3. Pegar la URL y clic en Suscribirse

**iOS:**
1. Abrir Safari y navegar a:
   ```
   webcal://yourusername.github.io/worldcup-2026-calendar/full-worldcup-2026.ics
   ```
2. Tocar "Suscribirse" cuando se solicite

### Outlook

1. Abrir Calendario de Outlook
2. Agregar Calendario → Desde Internet
3. Pegar la URL del archivo `.ics`

---

## 🕐 Manejo de Zonas Horarias

**Esta es la prioridad #1 del proyecto.**

Cada partido almacena su hora de inicio en la **zona horaria local del estadio** usando identificadores IANA obtenidos de la API oficial de FIFA:

| Zona Horaria | Ciudades |
|--------------|----------|
| `America/Mexico_City` | Ciudad de México, Guadalajara |
| `America/Monterrey` | Monterrey |
| `America/New_York` | Nueva York, Atlanta, Miami, Filadelfia, Boston |
| `America/Toronto` | Toronto |
| `America/Chicago` | Dallas, Houston, Kansas City |
| `America/Los_Angeles` | Los Ángeles, San Francisco, Seattle |
| `America/Vancouver` | Vancouver |

Cuando importas el calendario:
- Tu app de calendario lee los datos embebidos `VTIMEZONE` + `TZID`
- Convierte automáticamente cada hora de inicio a **tu zona horaria local**
- Las transiciones DST se manejan correctamente (EE.UU./Canadá observan DST; México no)

**No se necesita conversión manual de UTC.**

### Ejemplo de Evento ICS

```ics
DTSTART;TZID=America/Mexico_City:20260611T130000
DTEND;TZID=America/Mexico_City:20260611T150000
SUMMARY:⚽ [Group A] 🇲🇽 Mexico vs South Africa 🇿🇦
LOCATION:Estadio Azteca\, Mexico City\, Mexico
```

Un usuario en Madrid verá automáticamente este partido a las 21:00 CEST. Un usuario en Buenos Aires lo verá a las 16:00 ART. Sin intervención manual.

---

## 🏟️ Estadios

| Estadio | Ciudad | País | Zona Horaria |
|---------|--------|------|--------------|
| Estadio Azteca | Ciudad de México | 🇲🇽 | `America/Mexico_City` |
| Estadio Akron | Guadalajara | 🇲🇽 | `America/Mexico_City` |
| Estadio BBVA | Monterrey | 🇲🇽 | `America/Monterrey` |
| MetLife Stadium | Nueva York | 🇺🇸 | `America/New_York` |
| SoFi Stadium | Los Ángeles | 🇺🇸 | `America/Los_Angeles` |
| AT&T Stadium | Dallas | 🇺🇸 | `America/Chicago` |
| Mercedes-Benz Stadium | Atlanta | 🇺🇸 | `America/New_York` |
| Arrowhead Stadium | Kansas City | 🇺🇸 | `America/Chicago` |
| NRG Stadium | Houston | 🇺🇸 | `America/Chicago` |
| Lincoln Financial Field | Filadelfia | 🇺🇸 | `America/New_York` |
| Levi's Stadium | San Francisco Bay Area | 🇺🇸 | `America/Los_Angeles` |
| Hard Rock Stadium | Miami | 🇺🇸 | `America/New_York` |
| Lumen Field | Seattle | 🇺🇸 | `America/Los_Angeles` |
| Gillette Stadium | Boston | 🇺🇸 | `America/New_York` |
| BMO Field | Toronto | 🇨🇦 | `America/Toronto` |
| BC Place | Vancouver | 🇨🇦 | `America/Vancouver` |

---

## 🏗️ Arquitectura del Proyecto

```
worldcup-2026-calendar/
├── src/
│   ├── data/
│   │   ├── matches.json              ← Generado automáticamente desde la API de FIFA
│   │   ├── teams.json                ← 48 equipos con banderas y grupos
│   │   ├── groups.json               ← 12 grupos con colores y ciudades
│   │   └── stadiums.json             ← 16 estadios con coordenadas
│   ├── services/
│   │   ├── fifaOfficialApi.ts        ← Cliente API de FIFA (fuente de verdad)
│   │   ├── fifaDataService.ts        ← Capa de acceso a datos
│   │   ├── calendarService.ts        ← Generación ICS RFC5545
│   │   └── timezoneService.ts        ← Componentes VTIMEZONE
│   ├── generators/
│   │   ├── generateAllCalendars.ts   ← Orquestador maestro
│   │   ├── generateGroupCalendars.ts
│   │   ├── generateTeamCalendars.ts
│   │   └── generateKnockoutCalendars.ts
│   ├── scripts/
│   │   ├── fetchOfficialData.ts      ← Obtiene datos de la API de FIFA
│   │   ├── updateOfficialData.ts     ← Actualiza datos (usado por CI/CD)
│   │   └── validateMatches.ts        ← Validador con comparación en vivo
│   ├── utils/
│   │   ├── dateUtils.ts              ← Manejo de fechas con Luxon
│   │   ├── flags.ts                  ← Emojis de banderas nacionales
│   │   ├── colors.ts                 ← Paleta de colores por grupo
│   │   └── formatting.ts            ← Utilidades de formateo
│   └── index.ts                      ← Punto de entrada
├── .github/workflows/update.yml      ← CI/CD: fetch → validate → generate → deploy
├── package.json
├── tsconfig.json
└── README.md
```

### Flujo de Datos

```
api.fifa.com ──→ fifaOfficialApi.ts ──→ matches.json ──→ fifaDataService.ts ──→ generadores ──→ output/*.ics
     │                                       │
     │                                       ├── Horarios oficiales de inicio
     │                                       ├── Sedes oficiales
     │                                       ├── Equipos y grupos oficiales
     │                                       └── IDs oficiales de partido FIFA
     │
     └── Validación en vivo via validate:live
```

---

## ⚙️ CI/CD con GitHub Actions

El workflow incluido (`.github/workflows/update.yml`) automatiza todo:

1. ⏰ Se ejecuta **diariamente a las 06:00 UTC**
2. 🌐 **Obtiene datos frescos** desde la API oficial de FIFA
3. 🔍 **Valida contra datos en vivo** — falla el build si hay desajustes
4. 📅 **Regenera** todos los 87 archivos `.ics`
5. 💾 **Commitea cambios** al repositorio
6. 🌐 **Despliega** a GitHub Pages para suscripción pública

Si FIFA cambia la hora de inicio, sede, o equipos de un partido, la siguiente ejecución del workflow actualizará automáticamente todos los calendarios.

### Configurar GitHub Pages

1. Ir a Configuración del repositorio → Pages
2. Establecer Source a "GitHub Actions"
3. El workflow maneja todo lo demás

### Activación Manual

También puedes activar el workflow manualmente desde la pestaña Actions de GitHub, o automáticamente al hacer push a `main`.

---

## 📊 Características de Eventos

Cada evento del calendario incluye:

- 🏳️ **Emojis de banderas** para ambos equipos (ej. 🇲🇽 🇿🇦)
- 🏟️ **Nombre del estadio**, ciudad y país
- 🕐 **Hora de inicio con zona horaria** (conversión automática para el usuario)
- ⏰ **Recordatorios** a 30 minutos y 1 hora antes del inicio
- 📋 **Categorías** con colores por grupo
- 🆔 **UIDs estables** (`match-N@worldcup2026.fifa`) — los eventos se actualizan en su lugar, nunca se duplican
- 📝 **Descripciones enriquecidas** con detalles del partido
- 🎨 **Colores de grupo** vía `CATEGORIES` + `X-APPLE-CALENDAR-COLOR`
- ✅ **Componentes VTIMEZONE conformes a RFC5545**
- 🔄 **Intervalo de actualización** de 12 horas (`REFRESH-INTERVAL;VALUE=DURATION:PT12H`)

### Ejemplo de Descripción de Evento

```
🏆 FIFA World Cup 2026™

⚽ Match 1
📋 Group Stage — Group A

🇲🇽 Mexico  vs  South Africa 🇿🇦

🏟️ Estadio Azteca
📍 Mexico City, Mexico
🕐 1:00 PM CST (Local Time)
📅 Thursday, June 11, 2026
🌐 Timezone: America/Mexico_City
🎨 Category: Green (Group A)

ℹ️ Opening Match

─────────────────────
🌐 fifa.com/worldcup
🎫 Match #1
```

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **Node.js 20+** | Runtime |
| **TypeScript** | Tipado estricto en todo el proyecto |
| **Luxon** | Manejo de zonas horarias y conversión de fechas |
| **pnpm** | Gestor de paquetes |
| **ESLint** | Linting de código |
| **Prettier** | Formateo de código |
| **tsx** | Ejecución directa de TypeScript |
| **GitHub Actions** | CI/CD automatizado |

---

## 🔧 Desarrollo

```bash
# Verificación de tipos
pnpm typecheck

# Linting
pnpm lint
pnpm lint:fix

# Formateo
pnpm format
pnpm format:check

# Limpiar salida
pnpm clean
```

---

## 📜 Licencia

MIT

---

## ⚠️ Aviso Legal

Este proyecto no está afiliado ni respaldado por FIFA. Los datos de partidos se obtienen directamente de la API oficial pública de FIFA (`api.fifa.com`). Los horarios de inicio para partidos de eliminatorias pueden usar datos provisionales hasta que FIFA confirme los horarios oficiales.

---

**Hecho con ❤️ para fans del fútbol en todo el mundo.**
