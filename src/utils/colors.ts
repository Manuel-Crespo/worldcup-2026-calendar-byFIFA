/**
 * Color definitions per group for calendar categories.
 * These colors are compatible with Apple Calendar and Google Calendar category systems.
 */

export interface GroupColor {
  name: string;
  hex: string;
  appleCalendarColor: string;
  googleCalendarColorId: string;
}

export const GROUP_COLORS: Record<string, GroupColor> = {
  A: { name: 'Green', hex: '#22C55E', appleCalendarColor: 'green', googleCalendarColorId: '2' },
  B: { name: 'Blue', hex: '#3B82F6', appleCalendarColor: 'blue', googleCalendarColorId: '9' },
  C: { name: 'Yellow', hex: '#EAB308', appleCalendarColor: 'yellow', googleCalendarColorId: '5' },
  D: { name: 'Red', hex: '#EF4444', appleCalendarColor: 'red', googleCalendarColorId: '11' },
  E: { name: 'Purple', hex: '#A855F7', appleCalendarColor: 'purple', googleCalendarColorId: '3' },
  F: { name: 'Orange', hex: '#F97316', appleCalendarColor: 'orange', googleCalendarColorId: '6' },
  G: { name: 'Pink', hex: '#EC4899', appleCalendarColor: 'pink', googleCalendarColorId: '4' },
  H: { name: 'Teal', hex: '#14B8A6', appleCalendarColor: 'teal', googleCalendarColorId: '7' },
  I: { name: 'Indigo', hex: '#6366F1', appleCalendarColor: 'purple', googleCalendarColorId: '1' },
  J: { name: 'Rose', hex: '#F43F5E', appleCalendarColor: 'red', googleCalendarColorId: '11' },
  K: { name: 'Lime', hex: '#84CC16', appleCalendarColor: 'green', googleCalendarColorId: '10' },
  L: { name: 'Cyan', hex: '#06B6D4', appleCalendarColor: 'blue', googleCalendarColorId: '9' },
};

/** Knockout stage color */
export const KNOCKOUT_COLOR: GroupColor = {
  name: 'Gold',
  hex: '#F59E0B',
  appleCalendarColor: 'orange',
  googleCalendarColorId: '5',
};

/**
 * Get the color configuration for a given group letter or knockout stage.
 */
export function getGroupColor(group: string | null): GroupColor {
  if (!group) return KNOCKOUT_COLOR;
  return GROUP_COLORS[group] ?? KNOCKOUT_COLOR;
}
