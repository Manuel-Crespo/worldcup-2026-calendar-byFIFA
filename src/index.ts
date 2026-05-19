/**
 * FIFA World Cup 2026 Calendar Generator
 *
 * Main entry point — generates all calendar files.
 * Run with: pnpm generate
 */

import { generateAllCalendars } from './generators/generateAllCalendars.js';

async function main(): Promise<void> {
  try {
    await generateAllCalendars();
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

main();
