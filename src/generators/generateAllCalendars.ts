/**
 * Generate ALL calendar files for the FIFA World Cup 2026.
 *
 * This is the master generator that orchestrates all sub-generators
 * and produces the complete output directory.
 */

import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { fifaDataService } from '../services/fifaDataService.js';
import { writeCalendarFile } from '../services/calendarService.js';
import { generateTeamCalendars } from './generateTeamCalendars.js';
import { generateGroupCalendars } from './generateGroupCalendars.js';
import { generateKnockoutCalendars } from './generateKnockoutCalendars.js';
import { slugify } from '../utils/formatting.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', '..', 'output');

export async function generateAllCalendars(): Promise<void> {
  console.log('🏆 FIFA World Cup 2026™ Calendar Generator');
  console.log('==========================================\n');

  // Load data
  fifaDataService.load();
  const allMatches = fifaDataService.getAllMatches();

  console.log(`📊 Loaded ${allMatches.length} matches\n`);

  // 1. Full tournament calendar
  console.log('📅 Generating full tournament calendar...');
  writeCalendarFile(
    join(OUTPUT_DIR, 'full-worldcup-2026.ics'),
    allMatches,
    '⚽ FIFA World Cup 2026™',
    'Complete schedule for all 104 matches of the FIFA World Cup 2026 in Canada, Mexico, and the United States.',
  );

  // 2. Group calendars
  console.log('\n📋 Generating group calendars...');
  generateGroupCalendars(OUTPUT_DIR);

  // 3. Team calendars
  console.log('\n🏴 Generating team calendars...');
  generateTeamCalendars(OUTPUT_DIR);

  // 4. Knockout stage calendar
  console.log('\n🏆 Generating knockout stage calendars...');
  generateKnockoutCalendars(OUTPUT_DIR);

  // 5. Host country calendars
  console.log('\n🌎 Generating host country calendars...');
  generateHostCountryCalendars(OUTPUT_DIR);

  // 6. Stadium calendars
  console.log('\n🏟️  Generating stadium calendars...');
  generateStadiumCalendars(OUTPUT_DIR);

  console.log('\n✨ All calendars generated successfully!');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
}

function generateHostCountryCalendars(outputDir: string): void {
  const countries = [
    { code: 'MEX', name: 'Mexico', flag: '🇲🇽' },
    { code: 'USA', name: 'United States', flag: '🇺🇸' },
    { code: 'CAN', name: 'Canada', flag: '🇨🇦' },
  ];

  for (const country of countries) {
    const matches = fifaDataService.getMatchesByCountry(country.code);
    const slug = slugify(country.name);
    writeCalendarFile(
      join(outputDir, 'hosts', `${slug}.ics`),
      matches,
      `${country.flag} FIFA World Cup 2026 - ${country.name}`,
      `All FIFA World Cup 2026 matches hosted in ${country.name}.`,
    );
  }
}

function generateStadiumCalendars(outputDir: string): void {
  const stadiumIds = fifaDataService.getAllStadiumIds();

  for (const stadiumId of stadiumIds) {
    const matches = fifaDataService.getMatchesByStadium(stadiumId);
    if (matches.length === 0) continue;

    const info = fifaDataService.getStadiumInfo(stadiumId);
    const name = info?.name ?? 'Unknown Stadium';
    const city = info?.city ?? '';
    const country = info?.country ?? '';

    const slug = slugify(name);
    writeCalendarFile(
      join(outputDir, 'stadiums', `${slug}.ics`),
      matches,
      `🏟️ ${name} - FIFA World Cup 2026`,
      `All FIFA World Cup 2026 matches at ${name}, ${city}, ${country}.`,
    );
  }
}

// Run if executed directly
generateAllCalendars().catch(console.error);
