/**
 * 點交頁密碼閘（Cloudflare Pages Function middleware）
 * 阿宏 2026-09-09：「以後點交頁給團隊版用」「你直接給外網連結即可」「並讓大家輸入密碼」
 *
 * 射程＝只擋 /dianjiao/ 底下，不影響 functions/api/line-webhook.js 與站上其餘頁面。
 *
 * 🔴 密碼「明文」不進 repo —— repo qihoom88-ctrl/ahong-site 是 PUBLIC，
 *    明文寫在這裡等於在 GitHub 上公告密碼。這裡只放加鹽後的 SHA-256。
 * 🔴 誠實講清楚這道閘擋得住什麼：擋的是「網站這一側」——沒密碼打不開頁面。
 *    擋不住的是 GitHub 那一側：點交頁的 HTML 原始碼本來就公開在 repo 裡。
 *    所以內部路徑／build 腳本／取號台帳一律不放點交頁（已於 2026-09-09 移除），
 *    密碼是給「不要讓客戶隨手點進來看到內部講法規範」用的，不是資安邊界。
 *    真要連 GitHub 那側一起擋，唯一解是 repo 轉 private（阿宏的帳號設定，我方碰不到）。
 *
 * Cloudflare Pages Functions 免費額度：每日 100,000 次請求（免費方案，不需綁卡，
 * 靜態資源不計入）—— 2026-09-09 查 developers.cloudflare.com/pages/functions/pricing/。
 */

/**
 * 🔴 阿宏 2026-09-09 拍板：「密碼 0930848000。以後固定密碼」
 *    ＝點交頁**全站共用同一組固定密碼**，🚫不要每個案子各發一組、🚫不要定期輪替。
 *    理由（他一路的做法）：團隊要能不查不問就打得開，密碼跟他的電話與網域同一組最好記。
 *    以後新增點交頁**不必改這裡**，這道閘擋的是整個 /dianjiao/。
 *    要換密碼＝改下面這行 HASH（算法 sha256('dianjiao|' + 新密碼)），明文永遠不寫進 repo。
 */
const HASH = '6970bd2e7fc99183c4ed7d69be814bd43243e355d2192c47d4c2f7d0ec97f44c';
const SALT = 'dianjiao|';
const COOKIE = 'dj_auth';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 天，團隊輸入一次可以用一個月

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/** 定時比較，避免用字串比較洩漏前綴資訊 */
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function loginPage(wrong) {
  const msg = wrong
    ? '<p class="err">密碼不對，再試一次</p>'
    : '<p class="hint">這是團隊內部頁，請輸入密碼</p>';
  return `<!doctype html><html lang="zh-Hant"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>點交頁</title><style>
:root{--bg:#f5f4f1;--card:#fff;--ink:#1c1b19;--dim:#6b6862;--line:#e2dfd9;--accent:#b8860b}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
 background:var(--bg);color:var(--ink);padding:24px;
 font:16px/1.7 -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif}
.box{width:100%;max-width:380px;background:var(--card);border:1px solid var(--line);
 border-radius:14px;padding:26px 22px;box-shadow:0 1px 2px rgba(0,0,0,.05),0 8px 24px rgba(0,0,0,.07)}
h1{font-size:19px;margin:0 0 4px}
.hint{color:var(--dim);font-size:14px;margin:0 0 18px}
.err{color:#a4342a;font-size:14px;margin:0 0 18px;font-weight:600}
input{width:100%;padding:14px;font-size:17px;border:1px solid var(--line);border-radius:10px;
 background:#fff;color:var(--ink);margin:0 0 12px}
button{width:100%;padding:15px;font-size:16px;font-weight:700;border:0;border-radius:10px;
 background:var(--accent);color:#fff}
.foot{margin:16px 0 0;font-size:12px;color:var(--dim);line-height:1.6}
@media (prefers-color-scheme:dark){
 :root{--bg:#171614;--card:#201f1c;--ink:#ece9e3;--dim:#9a958c;--line:#332f2a;--accent:#d4a01e}
 input{background:#171614;color:var(--ink)}
 button{color:#171614}
}
</style></head><body>
<form class="box" method="POST">
<h1>物件點交頁</h1>
${msg}
<input type="password" name="pw" placeholder="密碼" autocomplete="current-password" autofocus>
<button type="submit">進入</button>
<p class="foot">住商不動產 樹林站前加盟店<br>鴻石不動產經紀有限公司　02-2687-8822</p>
</form></body></html>`;
}

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // 密碼送出
  if (request.method === 'POST') {
    const form = await request.formData();
    const pw = (form.get('pw') || '').toString();
    if (safeEqual(await sha256(SALT + pw), HASH)) {
      return new Response(null, {
        status: 303,
        headers: {
          'Location': url.pathname,
          'Set-Cookie': `${COOKIE}=${HASH}; Path=/dianjiao/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
          'Cache-Control': 'no-store'
        }
      });
    }
    return new Response(loginPage(true), {
      status: 401,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
    });
  }

  // 已通過
  const cookie = request.headers.get('Cookie') || '';
  const hit = cookie.split(';').map(s => s.trim()).find(s => s.startsWith(COOKIE + '='));
  if (hit && safeEqual(hit.slice(COOKIE.length + 1), HASH)) {
    return next();
  }

  return new Response(loginPage(false), {
    status: 401,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}
