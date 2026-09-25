import { getState, json, error, parseIntInRange } from "../_shared/db.js";

/**
 * PUT /api/settings — 目標ポイントを更新
 * body: { goal }
 * @param {{ request: Request, env: { DB: D1Database } }} context
 */
export async function onRequestPut(context) {
  try {
    let body;
    try {
      body = await context.request.json();
    } catch {
      return error("不正なJSONです");
    }

    const goal = parseIntInRange(body?.goal, 1, 1000000);
    if (goal === null) return error("目標は1〜1,000,000 ptです");

    await context.env.DB.prepare(
      `INSERT INTO settings (id, goal) VALUES (1, ?)
       ON CONFLICT(id) DO UPDATE SET goal = excluded.goal`
    )
      .bind(goal)
      .run();

    const state = await getState(context.env.DB);
    return json(state);
  } catch (e) {
    console.error(e);
    return error("設定の更新に失敗しました", 500);
  }
}
