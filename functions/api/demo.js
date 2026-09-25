import { getState, json, error } from "../_shared/db.js";

/**
 * POST /api/demo — デモデータを投入（既存タスクは全削除）
 * @param {{ env: { DB: D1Database } }} context
 */
export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    const d = new Date().toISOString().slice(0, 10);
    const n = Date.now();

    const demo = [
      {
        id: crypto.randomUUID(),
        name: "FE問題を10問解く",
        cat: "学習",
        points: 500,
        minutes: 25,
        date: d,
        createdAt: new Date(n - 7200000).toISOString(),
      },
      {
        id: crypto.randomUUID(),
        name: "AIエージェントを調査",
        cat: "調査",
        points: 800,
        minutes: 40,
        date: d,
        createdAt: new Date(n - 3600000).toISOString(),
      },
      {
        id: crypto.randomUUID(),
        name: "UIを1画面完成",
        cat: "制作",
        points: 1000,
        minutes: 70,
        date: d,
        createdAt: new Date(n - 1200000).toISOString(),
      },
    ];

    const stmts = [
      db.prepare("DELETE FROM tasks"),
      ...demo.map((t) =>
        db
          .prepare(
            `INSERT INTO tasks (id, name, cat, points, minutes, date, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`
          )
          .bind(t.id, t.name, t.cat, t.points, t.minutes, t.date, t.createdAt)
      ),
    ];
    await db.batch(stmts);

    const state = await getState(db);
    return json(state);
  } catch (e) {
    console.error(e);
    return error("デモデータの投入に失敗しました", 500);
  }
}
