/**
 * Date and time utility functions using Luxon for timezone-safe operations.
 */

import { DateTime, Duration } from 'luxon';

/**
 * Create a timezone-aware DateTime from date string, time string, and IANA timezone.
 * This is the SINGLE SOURCE OF TRUTH for match kickoff times.
 *
 * @param date - ISO date string (YYYY-MM-DD)
 * @param time - Local time string (HH:mm)
 * @param timezone - IANA timezone identifier (e.g. "America/Mexico_City")
 * @returns Luxon DateTime in the specified timezone
 */
export function createKickoffDateTime(
  date: string,
  time: string,
  timezone: string,
): DateTime {
  const dt = DateTime.fromISO(`${date}T${time}:00`, { zone: timezone });
  if (!dt.isValid) {
    throw new Error(
      `Invalid date/time: ${date}T${time} in timezone ${timezone}: ${dt.invalidReason}`,
    );
  }
  return dt;
}

/**
 * Get match end time (estimated 2 hours after kickoff).
 */
export function getMatchEndTime(kickoff: DateTime): DateTime {
  return kickoff.plus(Duration.fromObject({ hours: 2 }));
}

/**
 * Get reminder time (default 30 minutes before kickoff).
 */
export function getReminderTime(kickoff: DateTime, minutesBefore: number = 30): DateTime {
  return kickoff.minus(Duration.fromObject({ minutes: minutesBefore }));
}

/**
 * Format a DateTime for display in event descriptions.
 */
export function formatForDescription(dt: DateTime): string {
  return dt.toFormat("cccc, LLLL d, yyyy 'at' h:mm a ZZZZ");
}

/**
 * Format date for ICS DTSTART/DTEND with TZID.
 * Returns format: YYYYMMDDTHHMMSS
 */
export function formatForICS(dt: DateTime): string {
  return dt.toFormat('yyyyMMdd') + 'T' + dt.toFormat('HHmmss');
}

/**
 * Convert DateTime to UTC for ICS compatibility.
 */
export function toUTCString(dt: DateTime): string {
  const utc = dt.toUTC();
  return utc.toFormat('yyyyMMdd') + 'T' + utc.toFormat('HHmmss') + 'Z';
}
