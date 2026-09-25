import { getState, json, error, parseIntInRange } from "../_shared/db.js";

/**
 * POST /api/tasks — 配達（タスク）を追加
 * body: { name, cat, points, minutes }
 * @param {{ request: Request, env: { DB: D1Database } }} context
 */
export async function onRequestPost(context) {
  try {
    let body;
    try {
      body = await context.request.json();
    } catch {
      return error("不正なJSONです");
    }

    const name = String(body?.name ?? "").trim();
    const cat = String(body?.cat ?? "").trim();
    const points = parseIntInRange(body?.points, 1, 100000);
    const minutes = parseIntInRange(body?.minutes ?? 0, 0, 1440);

    if (!name || name.length > 80) return error("タスク名は1〜80文字です");
    if (!cat) return error("カテゴリを指定してください");
    if (points === null) return error("ポイントは1〜100,000の整数です");
    if (minutes === null) return error("時間が不正です");

    const id = crypto.randomUUID();
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const createdAt = now.toISOString();

    await context.env.DB.prepare(
      `INSERT INTO tasks (id, name, cat, points, minutes, date, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(id, name, cat, points, minutes, date, createdAt)
      .run();

    const state = await getState(context.env.DB);
    return json(state, { status: 201 });
  } catch (e) {
    console.error(e);
    return error("登録に失敗しました", 500);
  }
}
