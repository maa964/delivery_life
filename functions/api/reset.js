import { getState, json, error } from "../_shared/db.js";

/**
 * DELETE /api/reset — 全タスク削除 & 目標を初期化
 * @param {{ env: { DB: D1Database } }} context
 */
export async function onRequestDelete(context) {
  try {
    const db = context.env.DB;
    await db.batch([
      db.prepare("DELETE FROM tasks"),
      db.prepare(
        `INSERT INTO settings (id, goal) VALUES (1, 3000)
         ON CONFLICT(id) DO UPDATE SET goal = 3000`
      ),
    ]);
    const state = await getState(db);
    return json(state);
  } catch (e) {
    console.error(e);
    return error("リセットに失敗しました", 500);
  }
}
