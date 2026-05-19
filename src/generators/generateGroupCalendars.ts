/**
 * Generate individual calendar files for each group.
 */

import { join } from 'path';
import { fifaDataService } from '../services/fifaDataService.js';
import { writeCalendarFile } from '../services/calendarService.js';
import { getGroupColor } from '../utils/colors.js';

export function generateGroupCalendars(outputDir: string): void {
  const groups = fifaDataService.getAllGroups();

  for (const [letter, groupInfo] of groups) {
    const matches = fifaDataService.getMatchesByGroup(letter);
    if (matches.length === 0) continue;

    const color = getGroupColor(letter);
    const teamCodes = groupInfo.teams;
    const teams = teamCodes
      .map((code) => fifaDataService.getTeam(code))
      .filter(Boolean);
    const teamNames = teams.map((t) => `${t!.flag} ${t!.name}`).join(', ');

    writeCalendarFile(
      join(outputDir, 'groups', `group-${letter.toLowerCase()}.ics`),
      matches,
      `⚽ Group ${letter} - FIFA World Cup 2026 (${color.name})`,
      `FIFA World Cup 2026 Group ${letter}: ${teamNames}.`,
    );
  }
}

// Run standalone
if (process.argv[1]?.includes('generateGroupCalendars')) {
  fifaDataService.load();
  const outputDir = join(process.cwd(), 'output');
  console.log('📋 Generating group calendars...');
  generateGroupCalendars(outputDir);
  console.log('✅ Done!');
}
