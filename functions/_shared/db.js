/**
 * @param {ResponseInit & { headers?: HeadersInit }} [init]
 */
export function json(data, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data), { ...init, headers });
}

/**
 * @param {string} message
 * @param {number} [status]
 */
export function error(message, status = 400) {
  return json({ error: message }, { status });
}

/**
 * @param {D1Database} db
 */
export async function getGoal(db) {
  const row = await db
    .prepare("SELECT goal FROM settings WHERE id = 1")
    .first();
  return row?.goal ?? 3000;
}

/**
 * @param {D1Database} db
 */
export async function listTasks(db) {
  const { results } = await db
    .prepare(
      `SELECT id, name, cat, points, minutes, date, created_at AS createdAt
       FROM tasks
       ORDER BY created_at ASC`
    )
    .all();
  return results ?? [];
}

/**
 * @param {D1Database} db
 */
export async function getState(db) {
  const [goal, tasks] = await Promise.all([getGoal(db), listTasks(db)]);
  return { goal, tasks };
}

/**
 * @param {unknown} value
 * @param {number} min
 * @param {number} max
 */
export function parseIntInRange(value, min, max) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) return null;
  return n;
}
