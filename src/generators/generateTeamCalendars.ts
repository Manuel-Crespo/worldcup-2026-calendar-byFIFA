/**
 * Generate individual calendar files for each national team.
 */

import { join } from 'path';
import { fifaDataService } from '../services/fifaDataService.js';
import { writeCalendarFile } from '../services/calendarService.js';
import { slugify } from '../utils/formatting.js';
import { getFlag } from '../utils/flags.js';

export function generateTeamCalendars(outputDir: string): void {
  const teams = fifaDataService.getAllTeams();

  for (const team of teams) {
    const matches = fifaDataService.getMatchesByTeam(team.id);
    if (matches.length === 0) continue;

    const slug = slugify(team.name);
    const flag = getFlag(team.id);

    writeCalendarFile(
      join(outputDir, 'teams', `${slug}.ics`),
      matches,
      `${flag} ${team.name} - FIFA World Cup 2026`,
      `FIFA World Cup 2026 group stage schedule for ${team.name} (Group ${team.group}).`,
    );
  }
}

// Run standalone
if (process.argv[1]?.includes('generateTeamCalendars')) {
  fifaDataService.load();
  const outputDir = join(process.cwd(), 'output');
  console.log('🏴 Generating team calendars...');
  generateTeamCalendars(outputDir);
  console.log('✅ Done!');
}
