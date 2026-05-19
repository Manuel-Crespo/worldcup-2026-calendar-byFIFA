/**
 * Update Official Data
 *
 * Fetches the latest data from FIFA API and regenerates all calendars.
 * Used by GitHub Actions CI/CD workflow.
 *
 * Run: pnpm update-data
 */

import { updateMatchesFromFIFA } from '../services/fifaOfficialApi.js';

async function main() {
  console.log('🔄 Updating official FIFA data...\n');

  try {
    const matches = await updateMatchesFromFIFA();
    console.log(`\n✅ Updated ${matches.length} matches from FIFA API`);
  } catch (error) {
    console.error('❌ Failed to update data:', error);
    process.exit(1);
  }
}

main();
