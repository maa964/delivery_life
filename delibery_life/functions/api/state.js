import { getState, json, error } from "../_shared/db.js";

/**
 * GET /api/state — 全タスク + 目標を返す
 * @param {{ env: { DB: D1Database } }} context
 */
export async function onRequestGet(context) {
  try {
    const state = await getState(context.env.DB);
    return json(state);
  } catch (e) {
    console.error(e);
    return error("データの取得に失敗しました", 500);
  }
}
