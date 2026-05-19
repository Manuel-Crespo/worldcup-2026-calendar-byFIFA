/**
 * Validate FIFA World Cup 2026 match data.
 *
 * Validates the local matches.json data and optionally compares
 * against the live FIFA API to detect mismatches.
 *
 * Run: pnpm validate
 * Run with live check: pnpm validate:live
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');

interface ValidatedMatch {
  matchNumber: number;
  fifaMatchId: string;
  date: string;
  time: string;
  dateUTC: string;
  stage: string;
  group: string | null;
  home: string;
  away: string;
  homeName: string;
  awayName: string;
  stadiumRealName: string;
  city: string;
  country: string;
  timezone: string;
}

async function main() {
  const isLive = process.argv.includes('--live');

  console.log('🔍 Validating FIFA World Cup 2026 match data...\n');

  // Load local matches.json
  const matchesFile = join(DATA_DIR, 'matches.json');
  const matchesData = JSON.parse(readFileSync(matchesFile, 'utf-8'));

  // Check _source field
  if (matchesData._source) {
    console.log(`📡 Data source: ${matchesData._source}`);
    console.log(`📅 Fetched at: ${matchesData._fetchedAt ?? 'unknown'}\n`);
  }

  const matches: ValidatedMatch[] = matchesData.matches;
  let errors = 0;

  // 1. Total match count
  if (matches.length === 104) {
    console.log(`✅ Total matches: ${matches.length}`);
  } else {
    console.log(`❌ Expected 104 matches, got ${matches.length}`);
    errors++;
  }

  // 2. Stage breakdown
  const stages = new Map<string, number>();
  for (const m of matches) {
    stages.set(m.stage, (stages.get(m.stage) ?? 0) + 1);
  }

  const expectedStages: Record<string, number> = {
    'Group Stage': 72,
    'Round of 32': 16,
    'Round of 16': 8,
    'Quarter-final': 4,
    'Semi-final': 2,
    'Third-place match': 1,
    'Final': 1,
  };

  for (const [stage, expected] of Object.entries(expectedStages)) {
    const actual = stages.get(stage) ?? 0;
    if (actual === expected) {
      console.log(`✅ ${stage}: ${actual} matches`);
    } else {
      console.log(`❌ ${stage}: expected ${expected}, got ${actual}`);
      errors++;
    }
  }

  // 3. Group stage: 12 groups × 6 matches
  const groupCounts = new Map<string, number>();
  for (const m of matches.filter((m: ValidatedMatch) => m.stage === 'Group Stage')) {
    if (m.group) {
      groupCounts.set(m.group, (groupCounts.get(m.group) ?? 0) + 1);
    }
  }

  let allGroupsOk = true;
  for (const letter of 'ABCDEFGHIJKL'.split('')) {
    const count = groupCounts.get(letter) ?? 0;
    if (count !== 6) {
      console.log(`❌ Group ${letter}: expected 6 matches, got ${count}`);
      allGroupsOk = false;
      errors++;
    }
  }
  if (allGroupsOk) {
    console.log('✅ All 12 groups have 6 matches each');
  }

  // 4. Match numbers 1-104 unique and sequential
  const matchNumbers = new Set(matches.map((m: ValidatedMatch) => m.matchNumber));
  let allNumbersOk = true;
  for (let i = 1; i <= 104; i++) {
    if (!matchNumbers.has(i)) {
      console.log(`❌ Missing match number ${i}`);
      allNumbersOk = false;
      errors++;
    }
  }
  if (allNumbersOk) {
    console.log('✅ Match numbers 1-104 all present and unique');
  }

  // 5. Dates within June-July 2026
  let allDatesOk = true;
  for (const m of matches) {
    const year = parseInt(m.date.substring(0, 4));
    const month = parseInt(m.date.substring(5, 7));
    if (year !== 2026 || month < 6 || month > 7) {
      console.log(`❌ Match ${m.matchNumber}: date ${m.date} outside expected range`);
      allDatesOk = false;
      errors++;
    }
  }
  if (allDatesOk) {
    console.log('✅ All matches within June-July 2026');
  }

  // 6. Timezone validation
  const validTimezones = new Set([
    'America/Mexico_City', 'America/Monterrey',
    'America/New_York', 'America/Chicago', 'America/Los_Angeles',
    'America/Toronto', 'America/Vancouver',
  ]);
  let allTimezonesOk = true;
  for (const m of matches) {
    if (!validTimezones.has(m.timezone)) {
      console.log(`❌ Match ${m.matchNumber}: invalid timezone ${m.timezone}`);
      allTimezonesOk = false;
      errors++;
    }
  }
  if (allTimezonesOk) {
    console.log('✅ All timezones are valid IANA identifiers');
  }

  // 7. All matches have FIFA match IDs
  const missingIds = matches.filter((m: ValidatedMatch) => !m.fifaMatchId);
  if (missingIds.length === 0) {
    console.log('✅ All matches have FIFA match IDs');
  } else {
    console.log(`❌ ${missingIds.length} matches missing FIFA match IDs`);
    errors++;
  }

  // Summary
  const uniqueStadiums = new Set(matches.map((m: ValidatedMatch) => m.stadiumRealName));
  const uniqueTeams = new Set(
    matches
      .filter((m: ValidatedMatch) => m.stage === 'Group Stage')
      .flatMap((m: ValidatedMatch) => [m.home, m.away]),
  );

  console.log('\n========================================');
  console.log(`📊 Stadiums: ${uniqueStadiums.size}`);
  console.log(`📊 Teams: ${uniqueTeams.size}`);
  console.log(`📊 Matches: ${matches.length}`);

  // Live comparison
  if (isLive) {
    console.log('\n🌐 Running live comparison against FIFA API...');
    errors += await compareLive(matches);
  }

  if (errors > 0) {
    console.log(`\n❌ ${errors} validation error(s) found!`);
    process.exit(1);
  } else {
    console.log('\n✅ All validations passed!');
  }
}

async function compareLive(localMatches: ValidatedMatch[]): Promise<number> {
  let errors = 0;

  try {
    const url = 'https://api.fifa.com/api/v3/calendar/matches?idCompetition=17&idSeason=285023&count=200&language=en';
    const response = await fetch(url);

    if (!response.ok) {
      console.log(`⚠️  FIFA API returned ${response.status}, skipping live comparison`);
      return 0;
    }

    const data = await response.json() as { Results: Array<{ IdMatch: string; Date: string; LocalDate: string; MatchNumber: number; Stadium?: { Name?: Array<{ Description: string }> }; Home?: { Abbreviation: string } | null; Away?: { Abbreviation: string } | null }> };
    const liveMatches = data.Results;

    console.log(`  📊 Live API returned ${liveMatches.length} matches`);

    if (liveMatches.length !== localMatches.length) {
      console.log(`  ❌ Match count mismatch: local=${localMatches.length}, live=${liveMatches.length}`);
      errors++;
    }

    // Compare each match
    for (const live of liveMatches) {
      const local = localMatches.find((m) => m.matchNumber === live.MatchNumber);
      if (!local) {
        console.log(`  ❌ Match ${live.MatchNumber}: missing in local data`);
        errors++;
        continue;
      }

      // Compare UTC date
      if (live.Date !== local.dateUTC) {
        console.log(`  ❌ Match ${live.MatchNumber}: date mismatch`);
        console.log(`     Local: ${local.dateUTC}`);
        console.log(`     Live:  ${live.Date}`);
        errors++;
      }

      // Compare teams (group stage only)
      if (live.Home?.Abbreviation && live.Home.Abbreviation !== local.home) {
        console.log(`  ❌ Match ${live.MatchNumber}: home team mismatch (${local.home} vs ${live.Home.Abbreviation})`);
        errors++;
      }
      if (live.Away?.Abbreviation && live.Away.Abbreviation !== local.away) {
        console.log(`  ❌ Match ${live.MatchNumber}: away team mismatch (${local.away} vs ${live.Away.Abbreviation})`);
        errors++;
      }
    }

    if (errors === 0) {
      console.log('  ✅ All matches match FIFA live data!');
    }
  } catch (error) {
    console.log(`  ⚠️  Live comparison failed: ${error}`);
  }

  return errors;
}

main();
