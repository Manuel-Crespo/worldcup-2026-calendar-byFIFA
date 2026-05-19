/**
 * Timezone Service
 *
 * Handles all timezone-related operations using Luxon.
 * Ensures correct IANA timezone handling for RFC5545 compliance.
 */

import { DateTime, IANAZone } from 'luxon';

/** All timezones used in the tournament */
export const TOURNAMENT_TIMEZONES = [
  'America/Mexico_City',
  'America/Monterrey',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'America/Toronto',
  'America/Vancouver',
] as const;

export type TournamentTimezone = (typeof TOURNAMENT_TIMEZONES)[number];

/**
 * Validate that a timezone string is a valid IANA timezone.
 */
export function isValidTimezone(tz: string): boolean {
  return IANAZone.isValidZone(tz);
}

/**
 * Get the UTC offset string for a given timezone at a specific date.
 * Returns format like "-05:00" or "-04:00" (accounting for DST).
 */
export function getUTCOffset(timezone: string, date: DateTime): string {
  const dt = date.setZone(timezone);
  return dt.toFormat('ZZ');
}

/**
 * Get a human-readable timezone abbreviation.
 * e.g., "EDT", "CDT", "PDT", "CST" (for Mexico)
 */
export function getTimezoneAbbreviation(timezone: string, date: DateTime): string {
  const dt = date.setZone(timezone);
  return dt.toFormat('ZZZZ');
}

/**
 * Generate VTIMEZONE component for ICS files.
 * This ensures proper timezone conversion in all calendar apps.
 */
export function generateVTimezone(timezone: string): string {
  // For the World Cup in June/July 2026, we need to handle DST correctly.
  // US/Canada observe DST (except parts), Mexico abolished DST in 2022.
  const zone = IANAZone.create(timezone);
  if (!zone.isValid) {
    throw new Error(`Invalid timezone: ${timezone}`);
  }

  // Use January 1 and July 1 to detect standard and daylight offsets
  const winter = DateTime.fromISO('2026-01-01T12:00:00', { zone: timezone });
  const summer = DateTime.fromISO('2026-07-01T12:00:00', { zone: timezone });

  const winterOffset = winter.offset;
  const summerOffset = summer.offset;

  const formatOffset = (minutes: number): string => {
    const sign = minutes >= 0 ? '+' : '-';
    const abs = Math.abs(minutes);
    const h = String(Math.floor(abs / 60)).padStart(2, '0');
    const m = String(abs % 60).padStart(2, '0');
    return `${sign}${h}${m}`;
  };

  const lines = [
    'BEGIN:VTIMEZONE',
    `TZID:${timezone}`,
  ];

  if (winterOffset !== summerOffset) {
    // Has DST - add both STANDARD and DAYLIGHT
    lines.push(
      'BEGIN:STANDARD',
      `DTSTART:20251102T020000`,
      'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
      `TZOFFSETFROM:${formatOffset(summerOffset)}`,
      `TZOFFSETTO:${formatOffset(winterOffset)}`,
      `TZNAME:${winter.toFormat('ZZZZ')}`,
      'END:STANDARD',
      'BEGIN:DAYLIGHT',
      `DTSTART:20260308T020000`,
      'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
      `TZOFFSETFROM:${formatOffset(winterOffset)}`,
      `TZOFFSETTO:${formatOffset(summerOffset)}`,
      `TZNAME:${summer.toFormat('ZZZZ')}`,
      'END:DAYLIGHT',
    );
  } else {
    // No DST (e.g., Mexico)
    lines.push(
      'BEGIN:STANDARD',
      'DTSTART:19700101T000000',
      `TZOFFSETFROM:${formatOffset(winterOffset)}`,
      `TZOFFSETTO:${formatOffset(winterOffset)}`,
      `TZNAME:${winter.toFormat('ZZZZ')}`,
      'END:STANDARD',
    );
  }

  lines.push('END:VTIMEZONE');
  return lines.join('\r\n');
}
