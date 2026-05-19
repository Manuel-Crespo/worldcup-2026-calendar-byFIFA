/**
 * FIFA Data Service
 *
 * Loads and resolves all match data from the official FIFA API cache.
 * All data originates from api.fifa.com — no manual schedules.
 * This is the central data access layer for the calendar generators.
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import type { MatchInfo } from '../utils/formatting.js';
import { createKickoffDateTime } from '../utils/dateUtils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');

/** Match record from the FIFA API-sourced matches.json */
export interface APIMatch {
  matchNumber: number;
  fifaMatchId: string;
  date: string;           // Local date YYYY-MM-DD
  time: string;           // Local time HH:mm
  dateUTC: string;        // UTC ISO string
  stage: string;
  group: string | null;
  home: string;           // Team abbreviation or placeholder
  away: string;
  homeName: string;       // Full team name
  awayName: string;
  stadiumId: string;
  stadiumFifaName: string;
  stadiumRealName: string;
  city: string;
  country: string;        // Country code (MEX, USA, CAN)
  timezone: string;       // IANA timezone
  timeDefined: boolean;
  placeholderA: string;
  placeholderB: string;
  description: string;
}

/** Team record from teams.json */
export interface Team {
  id: string;
  name: string;
  code: string;
  flag: string;
  confederation: string;
  group: string;
  fifaRanking: number;
}

/** Group record from groups.json */
export interface GroupInfo {
  name: string;
  color: string;
  colorName: string;
  teams: string[];
  hostCities: string[];
}

/** Resolved match with all related data hydrated */
export interface ResolvedMatch extends MatchInfo {
  fifaMatchId: string;
  stadiumId: string;
  stadiumRealName: string;
  timezone: string;
  countryCode: string;
  homeTeam: Team | null;
  awayTeam: Team | null;
}

/** Country code to name mapping */
const COUNTRY_NAMES: Record<string, string> = {
  MEX: 'Mexico',
  USA: 'United States',
  CAN: 'Canada',
};

class FIFADataService {
  private matches: APIMatch[] = [];
  private teams: Map<string, Team> = new Map();
  private groups: Map<string, GroupInfo> = new Map();
  private loaded = false;

  /** Load all data files from disk. */
  load(): void {
    if (this.loaded) return;

    const matchesData = JSON.parse(readFileSync(join(DATA_DIR, 'matches.json'), 'utf-8'));
    this.matches = matchesData.matches;

    // Teams and groups are still loaded for flag emojis and colors
    const teamsData = JSON.parse(readFileSync(join(DATA_DIR, 'teams.json'), 'utf-8'));
    for (const t of teamsData.teams) {
      this.teams.set(t.code, t as Team);
    }

    const groupsData = JSON.parse(readFileSync(join(DATA_DIR, 'groups.json'), 'utf-8'));
    for (const [key, value] of Object.entries(groupsData.groups)) {
      this.groups.set(key, value as GroupInfo);
    }

    this.loaded = true;
  }

  /** Get all resolved matches. */
  getAllMatches(): ResolvedMatch[] {
    this.load();
    return this.matches.map((m) => this.resolveMatch(m));
  }

  /** Get matches filtered by stage. */
  getMatchesByStage(stage: string): ResolvedMatch[] {
    return this.getAllMatches().filter((m) => m.stage === stage);
  }

  /** Get matches for a specific group. */
  getMatchesByGroup(group: string): ResolvedMatch[] {
    return this.getAllMatches().filter((m) => m.group === group);
  }

  /** Get matches for a specific team (by team code). */
  getMatchesByTeam(teamCode: string): ResolvedMatch[] {
    return this.getAllMatches().filter(
      (m) => m.homeCode === teamCode || m.awayCode === teamCode,
    );
  }

  /** Get matches at a specific stadium. */
  getMatchesByStadium(stadiumId: string): ResolvedMatch[] {
    return this.getAllMatches().filter((m) => m.stadiumId === stadiumId);
  }

  /** Get matches in a specific host country. */
  getMatchesByCountry(countryCode: string): ResolvedMatch[] {
    return this.getAllMatches().filter((m) => m.countryCode === countryCode);
  }

  /** Get all knockout stage matches. */
  getKnockoutMatches(): ResolvedMatch[] {
    return this.getAllMatches().filter((m) => m.stage !== 'Group Stage');
  }

  /** Get all unique stadium IDs. */
  getAllStadiumIds(): string[] {
    this.load();
    return [...new Set(this.matches.map((m) => m.stadiumId))];
  }

  /** Get stadium info for the first match at a given stadium ID. */
  getStadiumInfo(stadiumId: string): { name: string; city: string; country: string } | undefined {
    this.load();
    const match = this.matches.find((m) => m.stadiumId === stadiumId);
    if (!match) return undefined;
    return {
      name: match.stadiumRealName,
      city: match.city,
      country: COUNTRY_NAMES[match.country] ?? match.country,
    };
  }

  /** Get all teams. */
  getAllTeams(): Team[] {
    this.load();
    return Array.from(this.teams.values());
  }

  /** Get all group info. */
  getAllGroups(): Map<string, GroupInfo> {
    this.load();
    return this.groups;
  }

  /** Get a team by code. */
  getTeam(code: string): Team | undefined {
    this.load();
    return this.teams.get(code);
  }

  /** Resolve an API match into a fully hydrated ResolvedMatch. */
  private resolveMatch(raw: APIMatch): ResolvedMatch {
    const homeTeam = this.teams.get(raw.home) ?? null;
    const awayTeam = this.teams.get(raw.away) ?? null;

    const homeName = homeTeam?.name ?? raw.homeName;
    const awayName = awayTeam?.name ?? raw.awayName;

    const kickoff = createKickoffDateTime(raw.date, raw.time, raw.timezone);

    const countryName = COUNTRY_NAMES[raw.country] ?? raw.country;

    return {
      matchNumber: raw.matchNumber,
      fifaMatchId: raw.fifaMatchId,
      stage: raw.stage,
      group: raw.group,
      homeCode: raw.home,
      awayCode: raw.away,
      homeName,
      awayName,
      stadiumName: raw.stadiumRealName,
      stadiumId: raw.stadiumId,
      stadiumRealName: raw.stadiumRealName,
      city: raw.city,
      country: countryName,
      countryCode: raw.country,
      kickoff,
      description: raw.description,
      timezone: raw.timezone,
      homeTeam,
      awayTeam,
    };
  }
}

/** Singleton instance */
export const fifaDataService = new FIFADataService();
