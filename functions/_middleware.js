/**
 * Cloudflare Pages Functions Middleware
 * HTTP Basic 認証による簡易アクセス制限
 */
export async function onRequest(context) {
  const { request, env, next } = context;

  const authUser = env.AUTH_USER;
  const authPass = env.AUTH_PASS || env.AUTH_PASSWORD;

  // 環境変数が設定されていない場合は認証をスキップ（ローカル開発等の利便性のため）
  if (!authUser || !authPass) {
    return next();
  }

  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return createUnauthorizedResponse();
  }

  try {
    const base64 = authHeader.substring(6).trim();
    const decoded = atob(base64);
    const colonIndex = decoded.indexOf(":");

    if (colonIndex === -1) {
      return createUnauthorizedResponse();
    }

    const user = decoded.slice(0, colonIndex);
    const pass = decoded.slice(colonIndex + 1);

    if (user === authUser && pass === authPass) {
      return next();
    }
  } catch {
    return createUnauthorizedResponse();
  }

  return createUnauthorizedResponse();
}

function createUnauthorizedResponse() {
  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "WWW-Authenticate": 'Basic realm="DELIVERY LIFE", charset="UTF-8"',
    },
  });
}
