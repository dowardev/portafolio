/**
 * Sort a list of date-bearing items by their start date, newest first.
 *
 * Dates are stored as strings in mixed formats (Ionic datetime yields
 * "YYYY-MM", seed data uses full ISO strings). `new Date()` parses both, so we
 * compare by timestamp. Items without a usable start date sort to the end.
 */
export function sortByStartDateDesc<T extends { startDate?: string }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) => {
    return startDateTime(b) - startDateTime(a);
  });
}

function startDateTime(item: { startDate?: string }): number {
  if (!item.startDate) return -Infinity;
  const parsed = new Date(item.startDate).getTime();
  return Number.isNaN(parsed) ? -Infinity : parsed;
}
