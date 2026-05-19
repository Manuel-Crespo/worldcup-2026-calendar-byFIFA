/**
 * FIFA Official API Service
 *
 * Fetches match data directly from the official FIFA API at api.fifa.com.
 * This is the SINGLE SOURCE OF TRUTH for all match data.
 *
 * Discovered endpoints:
 *   GET https://api.fifa.com/api/v3/calendar/matches
 *     ?idCompetition=17          (FIFA World Cup)
 *     &idSeason=285023           (2026 season)
 *     &count=200                 (return all matches)
 *     &language=en
 *
 * Alternative (date-filtered, no season ID needed):
 *   GET https://api.fifa.com/api/v3/calendar/matches
 *     ?idCompetition=17
 *     &count=200
 *     &language=en
 *     &from=2026-06-01T00:00:00Z
 *     &to=2026-07-20T00:00:00Z
 *
 * The API returns:
 *   - Date: UTC kickoff timestamp
 *   - LocalDate: Local kickoff timestamp at the stadium
 *   - Stadium: { Name, CityName, IdCountry, IdStadium }
 *   - Home/Away: { Abbreviation, TeamName, IdTeam, IdCountry }
 *   - GroupName, StageName, MatchNumber, MatchDay
 *   - PlaceHolderA/B for knockout slots
 *   - Officials, Weather, Attendance (when available)
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const CACHE_FILE = join(DATA_DIR, 'fifa_api_cache.json');

/** FIFA API base URL */
const FIFA_API_BASE = 'https://api.fifa.com/api/v3';

/** FIFA World Cup competition ID */
const COMPETITION_ID = '17';

/** FIFA World Cup 2026 season ID (discovered from API) */
const SEASON_ID = '285023';

/** Stadium ID to IANA timezone mapping (official venues for 2026) */
const STADIUM_TIMEZONE_MAP: Record<string, string> = {
  // Mexico
  'Mexico City Stadium': 'America/Mexico_City',
  'Guadalajara Stadium': 'America/Mexico_City',
  'Monterrey Stadium': 'America/Monterrey',
  // USA - Eastern
  'New York/New Jersey Stadium': 'America/New_York',
  'Atlanta Stadium': 'America/New_York',
  'Miami Stadium': 'America/New_York',
  'Philadelphia Stadium': 'America/New_York',
  'Boston Stadium': 'America/New_York',
  // USA - Central
  'Dallas Stadium': 'America/Chicago',
  'Houston Stadium': 'America/Chicago',
  'Kansas City Stadium': 'America/Chicago',
  // USA - Pacific
  'Los Angeles Stadium': 'America/Los_Angeles',
  'San Francisco Bay Area Stadium': 'America/Los_Angeles',
  'Seattle Stadium': 'America/Los_Angeles',
  // Canada
  'Toronto Stadium': 'America/Toronto',
  'BC Place Vancouver': 'America/Vancouver',
};

/** Map FIFA stadium names to real stadium names */
const STADIUM_REAL_NAMES: Record<string, string> = {
  'Mexico City Stadium': 'Estadio Azteca',
  'Guadalajara Stadium': 'Estadio Akron',
  'Monterrey Stadium': 'Estadio BBVA',
  'New York/New Jersey Stadium': 'MetLife Stadium',
  'Los Angeles Stadium': 'SoFi Stadium',
  'Dallas Stadium': 'AT&T Stadium',
  'Atlanta Stadium': 'Mercedes-Benz Stadium',
  'Kansas City Stadium': 'Arrowhead Stadium',
  'Houston Stadium': 'NRG Stadium',
  'Philadelphia Stadium': 'Lincoln Financial Field',
  'San Francisco Bay Area Stadium': "Levi's Stadium",
  'Miami Stadium': 'Hard Rock Stadium',
  'Seattle Stadium': 'Lumen Field',
  'Boston Stadium': 'Gillette Stadium',
  'Toronto Stadium': 'BMO Field',
  'BC Place Vancouver': 'BC Place',
};

/** FIFA API raw match structure */
export interface FIFAApiMatch {
  IdCompetition: string;
  IdSeason: string;
  IdStage: string;
  IdGroup: string;
  IdMatch: string;
  MatchNumber: number;
  MatchDay: string;
  Date: string;          // UTC timestamp
  LocalDate: string;     // Local time at stadium
  TimeDefined: boolean;
  MatchStatus: number;
  ResultType: number;
  PlaceHolderA: string;
  PlaceHolderB: string;
  StageName: Array<{ Locale: string; Description: string }>;
  GroupName: Array<{ Locale: string; Description: string }>;
  CompetitionName: Array<{ Locale: string; Description: string }>;
  SeasonName: Array<{ Locale: string; Description: string }>;
  Home: FIFAApiTeam | null;
  Away: FIFAApiTeam | null;
  HomeTeamScore: number | null;
  AwayTeamScore: number | null;
  Stadium: FIFAApiStadium;
  Officials: FIFAApiOfficial[];
  Weather: FIFAApiWeather | null;
  Attendance: string | null;
}

export interface FIFAApiTeam {
  IdTeam: string;
  IdCountry: string;
  Abbreviation: string;
  TeamName: Array<{ Locale: string; Description: string }>;
  ShortClubName: string;
  PictureUrl: string;
}

export interface FIFAApiStadium {
  IdStadium: string;
  Name: Array<{ Locale: string; Description: string }>;
  CityName: Array<{ Locale: string; Description: string }>;
  IdCountry: string;
  Capacity: number | null;
  Latitude: number | null;
  Longitude: number | null;
}

export interface FIFAApiOfficial {
  OfficialId: string;
  Name: Array<{ Locale: string; Description: string }>;
  IdCountry: string;
  OfficialType: number;
  TypeLocalized: Array<{ Locale: string; Description: string }>;
}

export interface FIFAApiWeather {
  Humidity: string;
  Temperature: string;
  WindSpeed: string;
  Type: number;
  TypeLocalized: Array<{ Locale: string; Description: string }>;
}

/** API response structure */
interface FIFAApiResponse {
  ContinuationToken: string | null;
  ContinuationHash: string | null;
  Results: FIFAApiMatch[];
}

/** Normalized match data from FIFA API */
export interface OfficialMatch {
  fifaMatchId: string;
  matchNumber: number;
  matchDay: string;
  date: string;                 // ISO date (YYYY-MM-DD) in LOCAL timezone
  time: string;                 // Local kickoff time (HH:mm)
  dateUTC: string;              // UTC ISO string
  stage: string;                // Normalized stage name
  group: string | null;         // Group letter or null
  home: string;                 // Team abbreviation or placeholder
  away: string;                 // Team abbreviation or placeholder
  homeName: string;             // Full team name
  awayName: string;             // Full team name
  stadiumId: string;            // FIFA stadium ID
  stadiumFifaName: string;      // FIFA display name
  stadiumRealName: string;      // Real stadium name
  city: string;
  country: string;              // Country code
  timezone: string;             // IANA timezone
  timeDefined: boolean;
  homeScore: number | null;
  awayScore: number | null;
  attendance: string | null;
  placeholderA: string;
  placeholderB: string;
  description: string;
}

/**
 * Fetch all 104 matches from the official FIFA API.
 * Uses date-based filtering to ensure we get the 2026 tournament.
 */
export async function fetchOfficialMatches(): Promise<OfficialMatch[]> {
  console.log('🌐 Fetching official FIFA World Cup 2026 data from api.fifa.com...');

  const url = new URL(`${FIFA_API_BASE}/calendar/matches`);
  url.searchParams.set('idCompetition', COMPETITION_ID);
  url.searchParams.set('idSeason', SEASON_ID);
  url.searchParams.set('count', '200');
  url.searchParams.set('language', 'en');

  const response = await fetch(url.toString());

  if (!response.ok) {
    // Fallback: date-based filtering if season ID fails
    console.log('⚠️  Season ID failed, trying date-based filtering...');
    const fallbackUrl = new URL(`${FIFA_API_BASE}/calendar/matches`);
    fallbackUrl.searchParams.set('idCompetition', COMPETITION_ID);
    fallbackUrl.searchParams.set('count', '200');
    fallbackUrl.searchParams.set('language', 'en');
    fallbackUrl.searchParams.set('from', '2026-06-01T00:00:00Z');
    fallbackUrl.searchParams.set('to', '2026-07-20T00:00:00Z');

    const fallbackResponse = await fetch(fallbackUrl.toString());
    if (!fallbackResponse.ok) {
      throw new Error(`FIFA API request failed: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
    }
    const fallbackData: FIFAApiResponse = await fallbackResponse.json() as FIFAApiResponse;
    return processApiResponse(fallbackData);
  }

  const data: FIFAApiResponse = await response.json() as FIFAApiResponse;

  // Handle pagination if needed
  let allResults = data.Results;
  let continuationToken = data.ContinuationToken;

  while (continuationToken) {
    const nextUrl = new URL(`${FIFA_API_BASE}/calendar/matches`);
    nextUrl.searchParams.set('idCompetition', COMPETITION_ID);
    nextUrl.searchParams.set('idSeason', SEASON_ID);
    nextUrl.searchParams.set('count', '200');
    nextUrl.searchParams.set('language', 'en');
    nextUrl.searchParams.set('ContinuationToken', continuationToken);

    const nextResponse = await fetch(nextUrl.toString());
    if (!nextResponse.ok) break;

    const nextData: FIFAApiResponse = await nextResponse.json() as FIFAApiResponse;
    allResults = allResults.concat(nextData.Results);
    continuationToken = nextData.ContinuationToken;
  }

  console.log(`  📊 Received ${allResults.length} matches from FIFA API`);

  return processApiResponse({ ...data, Results: allResults });
}

/**
 * Process raw API response into normalized match data.
 */
function processApiResponse(data: FIFAApiResponse): OfficialMatch[] {
  return data.Results
    .map((raw) => normalizeMatch(raw))
    .sort((a, b) => a.matchNumber - b.matchNumber);
}

/**
 * Normalize a single FIFA API match into our format.
 */
function normalizeMatch(raw: FIFAApiMatch): OfficialMatch {
  const stadiumFifaName = getLocalizedText(raw.Stadium?.Name) ?? 'TBD';
  const city = getLocalizedText(raw.Stadium?.CityName) ?? 'TBD';
  const country = raw.Stadium?.IdCountry ?? '';
  const timezone = STADIUM_TIMEZONE_MAP[stadiumFifaName] ?? inferTimezone(country, city);
  const stadiumRealName = STADIUM_REAL_NAMES[stadiumFifaName] ?? stadiumFifaName;

  // Parse local date from FIFA's LocalDate field
  // FIFA LocalDate is the kickoff time in the stadium's local timezone,
  // formatted as ISO 8601 but WITHOUT timezone info (it's implicitly local)
  const localDateStr = raw.LocalDate;
  const dateStr = localDateStr.substring(0, 10);         // YYYY-MM-DD
  const timeStr = localDateStr.substring(11, 16);        // HH:mm

  const stageName = getLocalizedText(raw.StageName) ?? '';
  const groupName = getLocalizedText(raw.GroupName) ?? '';
  const stage = normalizeStage(stageName);
  const group = extractGroupLetter(groupName);

  const homeCode = raw.Home?.Abbreviation ?? raw.PlaceHolderA ?? 'TBD';
  const awayCode = raw.Away?.Abbreviation ?? raw.PlaceHolderB ?? 'TBD';
  const homeName = raw.Home?.ShortClubName ?? getLocalizedText(raw.Home?.TeamName) ?? raw.PlaceHolderA ?? 'TBD';
  const awayName = raw.Away?.ShortClubName ?? getLocalizedText(raw.Away?.TeamName) ?? raw.PlaceHolderB ?? 'TBD';

  return {
    fifaMatchId: raw.IdMatch,
    matchNumber: raw.MatchNumber,
    matchDay: raw.MatchDay ?? '',
    date: dateStr,
    time: timeStr,
    dateUTC: raw.Date,
    stage,
    group,
    home: homeCode,
    away: awayCode,
    homeName,
    awayName,
    stadiumId: raw.Stadium?.IdStadium ?? '',
    stadiumFifaName,
    stadiumRealName,
    city,
    country,
    timezone,
    timeDefined: raw.TimeDefined,
    homeScore: raw.HomeTeamScore,
    awayScore: raw.AwayTeamScore,
    attendance: raw.Attendance,
    placeholderA: raw.PlaceHolderA ?? '',
    placeholderB: raw.PlaceHolderB ?? '',
    description: buildDescription(raw, stage),
  };
}

/** Normalize FIFA stage names to our format */
function normalizeStage(stage: string): string {
  if (stage.includes('First Stage') || stage.includes('Group')) return 'Group Stage';
  if (stage.includes('Round of 32')) return 'Round of 32';
  if (stage.includes('Round of 16')) return 'Round of 16';
  if (stage.includes('Quarter')) return 'Quarter-final';
  if (stage.includes('Semi')) return 'Semi-final';
  if (stage.includes('third') || stage.includes('Third')) return 'Third-place match';
  if (stage.includes('Final') && !stage.includes('Semi') && !stage.includes('Quarter')) return 'Final';
  // Fallback: return as-is but check for common FIFA patterns
  const lower = stage.toLowerCase();
  if (lower === 'final') return 'Final';
  if (lower.includes('play-off for third')) return 'Third-place match';
  return stage;
}

/** Extract group letter from FIFA group name like "Group A" */
function extractGroupLetter(groupName: string): string | null {
  if (!groupName) return null;
  const match = groupName.match(/Group\s+([A-L])/i);
  return match ? match[1].toUpperCase() : null;
}

/** Get English text from FIFA localized array */
function getLocalizedText(items?: Array<{ Locale: string; Description: string }> | null): string | null {
  if (!items || items.length === 0) return null;
  const english = items.find((i) => i.Locale.toLowerCase().startsWith('en'));
  return english?.Description ?? items[0]?.Description ?? null;
}

/** Build event description from raw FIFA data */
function buildDescription(raw: FIFAApiMatch, stage: string): string {
  const parts: string[] = [];
  if (raw.MatchNumber === 1) parts.push('Opening Match');
  if (stage === 'Final') parts.push('FIFA World Cup 2026™ Final');
  if (stage === 'Third-place match') parts.push('Third-place play-off');
  return parts.join(' | ');
}

/** Infer timezone from country and city when not in the map */
function inferTimezone(countryCode: string, city: string): string {
  // Fallback timezone inference
  if (countryCode === 'MEX') return 'America/Mexico_City';
  if (countryCode === 'CAN') {
    if (city.toLowerCase().includes('vancouver')) return 'America/Vancouver';
    return 'America/Toronto';
  }
  if (countryCode === 'USA') {
    const cityLower = city.toLowerCase();
    if (['los angeles', 'san francisco', 'seattle', 'santa clara', 'inglewood'].some((c) => cityLower.includes(c))) {
      return 'America/Los_Angeles';
    }
    if (['dallas', 'houston', 'kansas city', 'arlington'].some((c) => cityLower.includes(c))) {
      return 'America/Chicago';
    }
    return 'America/New_York';
  }
  return 'America/New_York'; // Safe default for 2026 venues
}

/**
 * Save fetched data to the cache file.
 */
export function saveCacheFile(matches: OfficialMatch[]): void {
  const cacheData = {
    fetchedAt: new Date().toISOString(),
    source: `${FIFA_API_BASE}/calendar/matches`,
    seasonId: SEASON_ID,
    competitionId: COMPETITION_ID,
    matchCount: matches.length,
    matches,
  };
  writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2), 'utf-8');
  console.log(`  💾 Cached ${matches.length} matches to ${CACHE_FILE}`);
}

/**
 * Load matches from the cache file.
 */
export function loadCachedMatches(): OfficialMatch[] | null {
  if (!existsSync(CACHE_FILE)) return null;
  try {
    const data = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
    return data.matches as OfficialMatch[];
  } catch {
    return null;
  }
}

/**
 * Generate the matches.json file from official FIFA data.
 * This replaces the manually curated data.
 */
export async function updateMatchesFromFIFA(): Promise<OfficialMatch[]> {
  const matches = await fetchOfficialMatches();

  if (matches.length !== 104) {
    console.warn(`⚠️  Expected 104 matches, got ${matches.length}`);
  }

  // Save to cache
  saveCacheFile(matches);

  // Generate matches.json in the format expected by fifaDataService
  const matchesJson = {
    _source: 'Official FIFA API (api.fifa.com)',
    _fetchedAt: new Date().toISOString(),
    _seasonId: SEASON_ID,
    matches: matches.map((m) => ({
      matchNumber: m.matchNumber,
      fifaMatchId: m.fifaMatchId,
      date: m.date,
      time: m.time,
      dateUTC: m.dateUTC,
      stage: m.stage,
      group: m.group,
      home: m.home,
      away: m.away,
      homeName: m.homeName,
      awayName: m.awayName,
      stadiumId: m.stadiumFifaName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      stadiumFifaName: m.stadiumFifaName,
      stadiumRealName: m.stadiumRealName,
      city: m.city,
      country: m.country,
      timezone: m.timezone,
      timeDefined: m.timeDefined,
      placeholderA: m.placeholderA,
      placeholderB: m.placeholderB,
      description: m.description,
    })),
  };

  writeFileSync(join(DATA_DIR, 'matches.json'), JSON.stringify(matchesJson, null, 2), 'utf-8');
  console.log(`  ✅ Updated matches.json with ${matches.length} official FIFA matches`);

  return matches;
}
