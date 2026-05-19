/**
 * Formatting utilities for event descriptions, titles, and locations.
 */

import { DateTime } from 'luxon';
import { getFlag, SOCCER_BALL, STADIUM, TROPHY } from './flags.js';
import { getGroupColor } from './colors.js';

export interface MatchInfo {
  matchNumber: number;
  stage: string;
  group: string | null;
  homeCode: string;
  awayCode: string;
  homeName: string;
  awayName: string;
  stadiumName: string;
  city: string;
  country: string;
  kickoff: DateTime;
  description: string;
}

/**
 * Generate the event summary/title for a match.
 */
export function formatEventSummary(match: MatchInfo): string {
  const homeFlag = getFlag(match.homeCode);
  const awayFlag = getFlag(match.awayCode);
  const stagePrefix = getStagePrefix(match.stage, match.group);

  return `${SOCCER_BALL} ${stagePrefix}${homeFlag} ${match.homeName} vs ${match.awayName} ${awayFlag}`;
}

/**
 * Generate the event location string.
 */
export function formatEventLocation(match: MatchInfo): string {
  return `${match.stadiumName}, ${match.city}, ${match.country}`;
}

/**
 * Generate the full event description with all match details.
 */
export function formatEventDescription(match: MatchInfo): string {
  const homeFlag = getFlag(match.homeCode);
  const awayFlag = getFlag(match.awayCode);
  const color = getGroupColor(match.group);

  const lines: string[] = [
    `${TROPHY} FIFA World Cup 2026™`,
    '',
    `${SOCCER_BALL} Match ${match.matchNumber}`,
    `📋 ${match.stage}${match.group ? ` — Group ${match.group}` : ''}`,
    '',
    `${homeFlag} ${match.homeName}  vs  ${match.awayName} ${awayFlag}`,
    '',
    `${STADIUM} ${match.stadiumName}`,
    `📍 ${match.city}, ${match.country}`,
    `🕐 ${match.kickoff.toFormat("h:mm a ZZZZ")} (Local Time)`,
    `📅 ${match.kickoff.toFormat('cccc, LLLL d, yyyy')}`,
    `🌐 Timezone: ${match.kickoff.zoneName}`,
  ];

  if (match.group) {
    lines.push(`🎨 Category: ${color.name} (Group ${match.group})`);
  }

  if (match.description) {
    lines.push('', `ℹ️ ${match.description}`);
  }

  lines.push(
    '',
    '─────────────────────',
    '🌐 fifa.com/worldcup',
    `🎫 Match #${match.matchNumber}`,
  );

  return lines.join('\n');
}

/**
 * Get a short stage prefix for the event title.
 */
function getStagePrefix(stage: string, group: string | null): string {
  if (stage === 'Group Stage' && group) return `[Group ${group}] `;
  if (stage === 'Round of 32') return '[R32] ';
  if (stage === 'Round of 16') return '[R16] ';
  if (stage === 'Quarter-final') return '[QF] ';
  if (stage === 'Semi-final') return '[SF] ';
  if (stage === 'Third-place match') return '[3rd] ';
  if (stage === 'Final') return `${TROPHY} [FINAL] `;
  return '';
}

/**
 * Generate a stable UID for a match event.
 * Uses match number to ensure UIDs remain consistent across regenerations.
 */
export function generateStableUID(matchNumber: number): string {
  return `match-${matchNumber}@worldcup2026.fifa`;
}

/**
 * Get the calendar category/tag for a match.
 */
export function getMatchCategory(stage: string, group: string | null): string[] {
  const categories = ['FIFA World Cup 2026'];
  if (stage === 'Group Stage' && group) {
    categories.push(`Group ${group}`);
  } else {
    categories.push(stage);
  }
  return categories;
}

/**
 * Slugify a string for use in filenames.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
