/**
 * Fetch Official FIFA Data
 *
 * Downloads all 104 match records from the official FIFA API
 * and writes them to src/data/matches.json.
 *
 * Run: pnpm fetch-data
 */

import { updateMatchesFromFIFA } from '../services/fifaOfficialApi.js';

async function main() {
  console.log('🌐 FIFA World Cup 2026 — Official Data Fetch');
  console.log('=============================================\n');

  try {
    const matches = await updateMatchesFromFIFA();

    console.log(`\n✅ Successfully fetched ${matches.length} matches from FIFA API`);

    // Quick verification
    const stages = new Map<string, number>();
    for (const m of matches) {
      stages.set(m.stage, (stages.get(m.stage) ?? 0) + 1);
    }

    console.log('\n📊 Stage breakdown:');
    for (const [stage, count] of stages) {
      console.log(`  ${stage}: ${count}`);
    }

    // Verify match #1
    const opening = matches.find((m) => m.matchNumber === 1);
    if (opening) {
      console.log(`\n🏟️  Opening match: ${opening.homeName} vs ${opening.awayName}`);
      console.log(`   📅 ${opening.date} at ${opening.time} local time`);
      console.log(`   🏟️ ${opening.stadiumRealName}, ${opening.city}`);
      console.log(`   🕐 Timezone: ${opening.timezone}`);
    }
  } catch (error) {
    console.error('❌ Failed to fetch data from FIFA API:', error);
    process.exit(1);
  }
}

main();
