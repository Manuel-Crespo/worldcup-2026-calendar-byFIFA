/**
 * Generate knockout stage calendar files.
 * Includes Round of 32, Round of 16, Quarter-finals, Semi-finals,
 * Third-place match, and Final.
 */

import { join } from 'path';
import { fifaDataService } from '../services/fifaDataService.js';
import { writeCalendarFile } from '../services/calendarService.js';

const KNOCKOUT_STAGES = [
  'Round of 32',
  'Round of 16',
  'Quarter-final',
  'Semi-final',
  'Third-place match',
  'Final',
] as const;

export function generateKnockoutCalendars(outputDir: string): void {
  // Full knockout calendar
  const allKnockout = fifaDataService.getKnockoutMatches();
  writeCalendarFile(
    join(outputDir, 'knockout-stage.ics'),
    allKnockout,
    '🏆 Knockout Stage - FIFA World Cup 2026',
    'All knockout stage matches: Round of 32, Round of 16, Quarter-finals, Semi-finals, Third-place match, and Final.',
  );

  // Individual stage calendars
  for (const stage of KNOCKOUT_STAGES) {
    const matches = fifaDataService.getMatchesByStage(stage);
    if (matches.length === 0) continue;

    const slug = stage.toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-');
    const emoji = getStageEmoji(stage);

    writeCalendarFile(
      join(outputDir, 'knockout', `${slug}.ics`),
      matches,
      `${emoji} ${stage} - FIFA World Cup 2026`,
      `FIFA World Cup 2026 ${stage} matches.`,
    );
  }
}

function getStageEmoji(stage: string): string {
  switch (stage) {
    case 'Round of 32': return '🔵';
    case 'Round of 16': return '🟢';
    case 'Quarter-final': return '🟡';
    case 'Semi-final': return '🟠';
    case 'Third-place match': return '🥉';
    case 'Final': return '🏆';
    default: return '⚽';
  }
}

// Run standalone
if (process.argv[1]?.includes('generateKnockoutCalendars')) {
  fifaDataService.load();
  const outputDir = join(process.cwd(), 'output');
  console.log('🏆 Generating knockout stage calendars...');
  generateKnockoutCalendars(outputDir);
  console.log('✅ Done!');
}
