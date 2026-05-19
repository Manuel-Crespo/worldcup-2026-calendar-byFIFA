# ⚽ FIFA World Cup 2026™ Calendar Generator

> **Archivos `.ics` con cumplimiento RFC5545 para los 104 partidos del Mundial 2026, con datos oficiales en tiempo real desde la API de FIFA.**

Obtiene automáticamente los horarios desde `api.fifa.com`, genera calendarios suscribibles con zonas horarias correctas, emojis de banderas, información de estadios y recordatorios. Compatible con **Google Calendar**, **Apple Calendar**, **Outlook** y cualquier cliente RFC5545.

---

## 🔗 Suscríbete Ahora

**URL pública de los calendarios:**

```
https://manuel-crespo.github.io/worldcup-2026-calendar-byFIFA/
```

### Torneo Completo (104 partidos)

| Método | URL |
|--------|-----|
| **webcal** (auto-sync) | `webcal://manuel-crespo.github.io/worldcup-2026-calendar-byFIFA/full-worldcup-2026.ics` |
| **HTTPS** (descarga) | `https://manuel-crespo.github.io/worldcup-2026-calendar-byFIFA/full-worldcup-2026.ics` |

### Solo Eliminatorias

```
webcal://manuel-crespo.github.io/worldcup-2026-calendar-byFIFA/knockout-stage.ics
```

### Por Equipo

Reemplaza `{equipo}` con el slug del equipo (ej. `mexico`, `brazil`, `argentina`, `united-states`):

```
webcal://manuel-crespo.github.io/worldcup-2026-calendar-byFIFA/teams/{equipo}.ics
```

<details>
<summary>📋 Lista completa de equipos y sus URLs</summary>

| Equipo | URL |
|--------|-----|
| 🇩🇿 Algeria | `teams/algeria.ics` |
| 🇦🇷 Argentina | `teams/argentina.ics` |
| 🇦🇺 Australia | `teams/australia.ics` |
| 🇦🇹 Austria | `teams/austria.ics` |
| 🇧🇪 Belgium | `teams/belgium.ics` |
| 🇧🇦 Bosnia | `teams/bosnia-and-herzegovina.ics` |
| 🇧🇷 Brazil | `teams/brazil.ics` |
| 🇨🇦 Canada | `teams/canada.ics` |
| 🇨🇻 Cape Verde | `teams/cape-verde.ics` |
| 🇨🇴 Colombia | `teams/colombia.ics` |
| 🇨🇩 Congo DR | `teams/congo-dr.ics` |
| 🇭🇷 Croatia | `teams/croatia.ics` |
| 🇨🇼 Curaçao | `teams/curaao.ics` |
| 🇨🇿 Czechia | `teams/czechia.ics` |
| 🇪🇨 Ecuador | `teams/ecuador.ics` |
| 🇪🇬 Egypt | `teams/egypt.ics` |
| 🏴󠁧󠁢󠁥󠁮󠁧󠁿 England | `teams/england.ics` |
| 🇫🇷 France | `teams/france.ics` |
| 🇩🇪 Germany | `teams/germany.ics` |
| 🇬🇭 Ghana | `teams/ghana.ics` |
| 🇭🇹 Haiti | `teams/haiti.ics` |
| 🇮🇷 Iran | `teams/iran.ics` |
| 🇮🇶 Iraq | `teams/iraq.ics` |
| 🇨🇮 Ivory Coast | `teams/ivory-coast.ics` |
| 🇯🇵 Japan | `teams/japan.ics` |
| 🇯🇴 Jordan | `teams/jordan.ics` |
| 🇰🇷 Korea Republic | `teams/korea-republic.ics` |
| 🇲🇽 Mexico | `teams/mexico.ics` |
| 🇲🇦 Morocco | `teams/morocco.ics` |
| 🇳🇱 Netherlands | `teams/netherlands.ics` |
| 🇳🇿 New Zealand | `teams/new-zealand.ics` |
| 🇳🇴 Norway | `teams/norway.ics` |
| 🇵🇦 Panama | `teams/panama.ics` |
| 🇵🇾 Paraguay | `teams/paraguay.ics` |
| 🇵🇹 Portugal | `teams/portugal.ics` |
| 🇶🇦 Qatar | `teams/qatar.ics` |
| 🇸🇦 Saudi Arabia | `teams/saudi-arabia.ics` |
| 🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland | `teams/scotland.ics` |
| 🇸🇳 Senegal | `teams/senegal.ics` |
| 🇿🇦 South Africa | `teams/south-africa.ics` |
| 🇪🇸 Spain | `teams/spain.ics` |
| 🇸🇪 Sweden | `teams/sweden.ics` |
| 🇨🇭 Switzerland | `teams/switzerland.ics` |
| 🇹🇷 Türkiye | `teams/trkiye.ics` |
| 🇹🇳 Tunisia | `teams/tunisia.ics` |
| 🇺🇸 United States | `teams/united-states.ics` |
| 🇺🇾 Uruguay | `teams/uruguay.ics` |
| 🇺🇿 Uzbekistan | `teams/uzbekistan.ics` |

</details>

### Por Grupo

```
webcal://manuel-crespo.github.io/worldcup-2026-calendar-byFIFA/groups/group-a.ics
```

| Grupo | Equipos | Archivo |
|-------|---------|---------|
| A | 🇲🇽 🇿🇦 🇰🇷 🇨🇿 | `groups/group-a.ics` |
| B | 🇨🇦 🇧🇦 🇶🇦 🇨🇭 | `groups/group-b.ics` |
| C | 🇧🇷 🇲🇦 🇭🇹 🏴󠁧󠁢󠁳󠁣󠁴󠁿 | `groups/group-c.ics` |
| D | 🇺🇸 🇵🇾 🇹🇷 🇦🇺 | `groups/group-d.ics` |
| E | 🇩🇪 🇨🇼 🇨🇮 🇪🇨 | `groups/group-e.ics` |
| F | 🇳🇱 🇯🇵 🇸🇪 🇹🇳 | `groups/group-f.ics` |
| G | 🇧🇪 🇪🇬 🇮🇷 🇳🇿 | `groups/group-g.ics` |
| H | 🇪🇸 🇨🇻 🇸🇦 🇺🇾 | `groups/group-h.ics` |
| I | 🇫🇷 🇸🇳 🇮🇶 🇳🇴 | `groups/group-i.ics` |
| J | 🇦🇷 🇩🇿 🇦🇹 🇯🇴 | `groups/group-j.ics` |
| K | 🇵🇹 🇨🇩 🇺🇿 🇨🇴 | `groups/group-k.ics` |
| L | 🏴󠁧󠁢󠁥󠁮󠁧󠁿 🇭🇷 🇬🇭 🇵🇦 | `groups/group-l.ics` |

### Por Estadio

```
webcal://manuel-crespo.github.io/worldcup-2026-calendar-byFIFA/stadiums/estadio-azteca.ics
```

| Estadio | Ciudad | Archivo |
|---------|--------|---------|
| Estadio Azteca | 🇲🇽 Ciudad de México | `stadiums/estadio-azteca.ics` |
| Estadio Akron | 🇲🇽 Guadalajara | `stadiums/estadio-akron.ics` |
| Estadio BBVA | 🇲🇽 Monterrey | `stadiums/estadio-bbva.ics` |
| MetLife Stadium | 🇺🇸 Nueva York | `stadiums/metlife-stadium.ics` |
| SoFi Stadium | 🇺🇸 Los Ángeles | `stadiums/sofi-stadium.ics` |
| AT&T Stadium | 🇺🇸 Dallas | `stadiums/att-stadium.ics` |
| Mercedes-Benz Stadium | 🇺🇸 Atlanta | `stadiums/mercedes-benz-stadium.ics` |
| Arrowhead Stadium | 🇺🇸 Kansas City | `stadiums/arrowhead-stadium.ics` |
| NRG Stadium | 🇺🇸 Houston | `stadiums/nrg-stadium.ics` |
| Lincoln Financial Field | 🇺🇸 Filadelfia | `stadiums/lincoln-financial-field.ics` |
| Levi's Stadium | 🇺🇸 San Francisco | `stadiums/levis-stadium.ics` |
| Hard Rock Stadium | 🇺🇸 Miami | `stadiums/hard-rock-stadium.ics` |
| Lumen Field | 🇺🇸 Seattle | `stadiums/lumen-field.ics` |
| Gillette Stadium | 🇺🇸 Boston | `stadiums/gillette-stadium.ics` |
| BMO Field | 🇨🇦 Toronto | `stadiums/bmo-field.ics` |
| BC Place | 🇨🇦 Vancouver | `stadiums/bc-place.ics` |

### Por País Anfitrión

| País | Partidos | Archivo |
|------|----------|---------|
| 🇲🇽 México | 13 | `hosts/mexico.ics` |
| 🇺🇸 Estados Unidos | 78 | `hosts/united-states.ics` |
| 🇨🇦 Canadá | 13 | `hosts/canada.ics` |

---

## 📲 Cómo Suscribirse

### Google Calendar

1. Ir a [Configuración de Google Calendar](https://calendar.google.com/calendar/r/settings/addcalendar)
2. Clic en **"Desde URL"**
3. Pegar:
   ```
   https://manuel-crespo.github.io/worldcup-2026-calendar-byFIFA/full-worldcup-2026.ics
   ```
4. Clic en **"Agregar calendario"**

### Apple Calendar

**macOS:** Archivo → Nueva Suscripción de Calendario → pegar la URL

**iOS:** Abrir en Safari:
```
webcal://manuel-crespo.github.io/worldcup-2026-calendar-byFIFA/full-worldcup-2026.ics
```

### Outlook

Agregar Calendario → Desde Internet → pegar la URL del `.ics`

---

## 📡 Fuente de Datos

Todos los horarios provienen de la **API oficial de FIFA**:

```
GET https://api.fifa.com/api/v3/calendar/matches
  ?idCompetition=17&idSeason=285023&count=200&language=en
```

El proyecto **nunca** usa horarios manuales. Cada ejecución de `pnpm fetch-data` descarga datos frescos de los servidores de FIFA.

---

## 🚀 Desarrollo Local

### Requisitos

- Node.js 20+
- pnpm 9+

### Instalación

```bash
git clone https://github.com/Manuel-Crespo/worldcup-2026-calendar-byFIFA.git
cd worldcup-2026-calendar-byFIFA
pnpm install
```

### Comandos

| Comando | Descripción |
|---------|-------------|
| `pnpm fetch-data` | Descarga los 104 partidos desde `api.fifa.com` |
| `pnpm validate` | Valida integridad de datos locales |
| `pnpm validate:live` | Valida contra la API de FIFA en vivo |
| `pnpm generate` | Genera los 87 archivos `.ics` |
| `pnpm update-data` | Fetch + actualiza `matches.json` (CI/CD) |
| `pnpm typecheck` | Verificación de tipos TypeScript |
| `pnpm lint` | Lint con ESLint |
| `pnpm format` | Formateo con Prettier |
| `pnpm clean` | Limpia `dist/` y `output/` |

---

## ⚙️ Despliegue Automático (GitHub Actions)

El workflow (`.github/workflows/update.yml`) se ejecuta:

- ⏰ **Diariamente** a las 06:00 UTC (midnight CST)
- 📦 **En cada push** a `main`
- 🖱️ **Manualmente** desde la pestaña Actions

### Pipeline

```
1. Checkout código
2. pnpm install
3. pnpm fetch-data       ← Descarga datos frescos de FIFA
4. pnpm validate:live    ← Falla si hay desajustes
5. pnpm generate         ← Genera 87 archivos .ics
6. git commit + push     ← Commitea cambios
7. Deploy GitHub Pages   ← Landing page + calendarios públicos
```

### Configurar GitHub Pages

1. Ve a **Settings → Pages** en tu repo
2. En Source selecciona **"GitHub Actions"**
3. El workflow maneja todo automáticamente

Después del primer deploy, los calendarios estarán disponibles en:
```
https://manuel-crespo.github.io/worldcup-2026-calendar-byFIFA/
```

---

## 🏗️ Arquitectura

```
worldcup-2026-calendar-byFIFA/
├── src/
│   ├── services/
│   │   ├── fifaOfficialApi.ts    ← Cliente API de FIFA (fuente de verdad)
│   │   ├── fifaDataService.ts    ← Capa de acceso a datos
│   │   ├── calendarService.ts    ← Generación ICS RFC5545
│   │   └── timezoneService.ts    ← Componentes VTIMEZONE
│   ├── generators/               ← Generadores por tipo de calendario
│   ├── scripts/                  ← fetch, validate, update
│   ├── data/                     ← matches.json (auto-generado), teams, groups
│   ├── pages/index.html          ← Landing page de GitHub Pages
│   └── utils/                    ← Fechas, banderas, colores, formateo
├── output/                       ← 87 archivos .ics generados
├── .github/workflows/update.yml  ← CI/CD automático
└── .env                          ← Configuración local
```

### Flujo de Datos

```
api.fifa.com → fifaOfficialApi.ts → matches.json → fifaDataService.ts → generadores → output/*.ics
                                                                                          ↓
                                                                              GitHub Pages (público)
```

---

## 📊 Características de Eventos

- 🏳️ Emojis de banderas para ambos equipos
- 🏟️ Nombre real del estadio, ciudad y país
- 🕐 Hora de inicio con zona horaria (conversión automática)
- ⏰ Recordatorios a 30 min y 1 hora antes
- 📋 Categorías con colores por grupo
- 🆔 UIDs estables — nunca se duplican
- ✅ Componentes VTIMEZONE RFC5545
- 🔄 Auto-actualización cada 12 horas

---

## 📜 Licencia

MIT

---

## ⚠️ Aviso Legal

Este proyecto no está afiliado ni respaldado por FIFA. Los datos se obtienen de la API pública de FIFA (`api.fifa.com`).

---

**Hecho con ❤️ para fans del fútbol en todo el mundo.**
