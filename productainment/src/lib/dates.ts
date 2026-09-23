// Dates are the artist's local calendar day as "YYYY-MM-DD", so a streak follows their clock, not the server's.
export function localDateString(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function shift(date: string, days: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Days in a row with at least one post, counting back from today (or yesterday, so the streak survives until tonight).
export function currentStreak(postedDates: string[], today: string) {
  const posted = new Set(postedDates);
  let cursor = posted.has(today) ? today : shift(today, -1);
  let streak = 0;
  while (posted.has(cursor)) {
    streak++;
    cursor = shift(cursor, -1);
  }
  return streak;
}

// A client-sent date must be within a day of the server's UTC date (covers every time zone).
export function isPlausibleToday(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const utc = new Date().toISOString().slice(0, 10);
  return [shift(utc, -1), utc, shift(utc, 1)].includes(date);
}
