/**
 * Country flag emoji mappings for all FIFA World Cup 2026 participants.
 * Uses Unicode regional indicator symbols.
 */

export const FLAG_EMOJIS: Record<string, string> = {
  MEX: '🇲🇽', RSA: '🇿🇦', KOR: '🇰🇷', CZE: '🇨🇿',
  CAN: '🇨🇦', BIH: '🇧🇦', QAT: '🇶🇦', SUI: '🇨🇭',
  BRA: '🇧🇷', MAR: '🇲🇦', HAI: '🇭🇹', SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  USA: '🇺🇸', PAR: '🇵🇾', TUR: '🇹🇷', AUS: '🇦🇺',
  GER: '🇩🇪', CUW: '🇨🇼', CIV: '🇨🇮', ECU: '🇪🇨',
  NED: '🇳🇱', JPN: '🇯🇵', SWE: '🇸🇪', TUN: '🇹🇳',
  BEL: '🇧🇪', EGY: '🇪🇬', IRN: '🇮🇷', NZL: '🇳🇿',
  ESP: '🇪🇸', CPV: '🇨🇻', KSA: '🇸🇦', URU: '🇺🇾',
  FRA: '🇫🇷', SEN: '🇸🇳', IRQ: '🇮🇶', NOR: '🇳🇴',
  ARG: '🇦🇷', ALG: '🇩🇿', AUT: '🇦🇹', JOR: '🇯🇴',
  POR: '🇵🇹', COD: '🇨🇩', UZB: '🇺🇿', COL: '🇨🇴',
  ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', CRO: '🇭🇷', GHA: '🇬🇭', PAN: '🇵🇦',
};

/** FIFA World Cup trophy emoji */
export const TROPHY = '🏆';

/** Soccer ball emoji */
export const SOCCER_BALL = '⚽';

/** Stadium emoji */
export const STADIUM = '🏟️';

/**
 * Get the flag emoji for a team code.
 * Returns a placeholder for knockout-stage TBD slots.
 */
export function getFlag(teamCode: string): string {
  return FLAG_EMOJIS[teamCode] ?? '🏳️';
}

/**
 * Format a match title with flag emojis.
 */
export function formatMatchTitle(
  homeCode: string,
  awayCode: string,
  homeName: string,
  awayName: string,
): string {
  const homeFlag = getFlag(homeCode);
  const awayFlag = getFlag(awayCode);
  return `${homeFlag} ${homeName} vs ${awayName} ${awayFlag}`;
}
