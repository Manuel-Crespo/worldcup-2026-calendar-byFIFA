/**
 * Calendar Service
 *
 * Generates RFC5545-compliant ICS calendar files.
 * Handles VTIMEZONE embedding, alarms, categories, and stable UIDs.
 *
 * Uses raw ICS generation (not ical-generator) for maximum control over
 * timezone handling and cross-client compatibility.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import type { ResolvedMatch } from './fifaDataService.js';
import {
  formatEventSummary,
  formatEventLocation,
  formatEventDescription,
  generateStableUID,
  getMatchCategory,
} from '../utils/formatting.js';
import { formatForICS } from '../utils/dateUtils.js';
import { getGroupColor } from '../utils/colors.js';
import { generateVTimezone } from './timezoneService.js';

/** ICS line folding per RFC5545 (max 75 octets per line) */
function foldLine(line: string): string {
  const maxLen = 75;
  if (line.length <= maxLen) return line;

  let result = line.substring(0, maxLen);
  let remaining = line.substring(maxLen);

  while (remaining.length > 0) {
    const chunk = remaining.substring(0, maxLen - 1);
    result += '\r\n ' + chunk;
    remaining = remaining.substring(maxLen - 1);
  }

  return result;
}

/** Escape text values per RFC5545 */
function escapeText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generate a complete ICS calendar string from a list of matches.
 */
export function generateICS(
  matches: ResolvedMatch[],
  calendarName: string,
  calendarDescription: string,
): string {
  // Collect unique timezones needed
  const timezones = new Set<string>();
  for (const match of matches) {
    timezones.add(match.timezone);
  }

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FIFA World Cup 2026//Calendar Generator//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(calendarName)}`,
    `X-WR-CALDESC:${escapeText(calendarDescription)}`,
    'X-WR-TIMEZONE:America/New_York',
    'X-APPLE-CALENDAR-COLOR:#1D4ED8',
    'REFRESH-INTERVAL;VALUE=DURATION:PT12H',
    'X-PUBLISHED-TTL:PT12H',
  ];

  // Add VTIMEZONE components
  for (const tz of timezones) {
    lines.push(generateVTimezone(tz));
  }

  // Add events
  for (const match of matches) {
    lines.push(generateVEvent(match));
  }

  lines.push('END:VCALENDAR');

  return lines.join('\r\n') + '\r\n';
}

/**
 * Generate a single VEVENT component for a match.
 */
function generateVEvent(match: ResolvedMatch): string {
  const uid = generateStableUID(match.matchNumber);
  const summary = formatEventSummary(match);
  const location = formatEventLocation(match);
  const description = formatEventDescription(match);
  const categories = getMatchCategory(match.stage, match.group);
  const color = getGroupColor(match.group);

  const dtStart = formatForICS(match.kickoff);
  // Match duration: approximately 2 hours
  const dtEnd = formatForICS(match.kickoff.plus({ hours: 2 }));

  const now = new Date();
  const dtstamp =
    now.getUTCFullYear().toString() +
    String(now.getUTCMonth() + 1).padStart(2, '0') +
    String(now.getUTCDate()).padStart(2, '0') +
    'T' +
    String(now.getUTCHours()).padStart(2, '0') +
    String(now.getUTCMinutes()).padStart(2, '0') +
    String(now.getUTCSeconds()).padStart(2, '0') +
    'Z';

  const lines: string[] = [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;TZID=${match.timezone}:${dtStart}`,
    `DTEND;TZID=${match.timezone}:${dtEnd}`,
    foldLine(`SUMMARY:${escapeText(summary)}`),
    foldLine(`LOCATION:${escapeText(location)}`),
    foldLine(`DESCRIPTION:${escapeText(description)}`),
    `CATEGORIES:${categories.map(escapeText).join(',')}`,
    `COLOR:${color.hex}`,
    `X-APPLE-CALENDAR-COLOR:${color.hex}`,
    `SEQUENCE:0`,
    `STATUS:CONFIRMED`,
    `TRANSP:OPAQUE`,
    // 30-minute reminder
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    foldLine(`DESCRIPTION:${escapeText(summary)} starts in 30 minutes!`),
    'END:VALARM',
    // 1-hour reminder
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    foldLine(`DESCRIPTION:${escapeText(summary)} starts in 1 hour!`),
    'END:VALARM',
    'END:VEVENT',
  ];

  return lines.join('\r\n');
}

/**
 * Write an ICS calendar to a file, creating directories as needed.
 */
export function writeCalendarFile(
  filePath: string,
  matches: ResolvedMatch[],
  calendarName: string,
  calendarDescription: string,
): void {
  const dir = dirname(filePath);
  mkdirSync(dir, { recursive: true });

  const icsContent = generateICS(matches, calendarName, calendarDescription);
  writeFileSync(filePath, icsContent, 'utf-8');

  console.log(`  ✅ ${filePath} (${matches.length} events)`);
}
