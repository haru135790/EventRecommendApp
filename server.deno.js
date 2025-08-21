import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

Deno.serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);

  const kv = await Deno.openKv();

  // イベント検索処理
  if (req.method === "POST" && pathname === "/find-event") {
    const event = await req.json();
    const cookie = req.headers.get("cookie") || "";
    const username = (() => {
      const match = cookie.match(/username=([^;]+)/);
      return match ? decodeURIComponent(match[1]) : "default";
    })();
    const listResult = await kv.list({ prefix: ["event", username] });
    const foundEvent = [];

    for await (const item of listResult) {

      const itemStart = new Date(item.value.event_start);
      const itemEnd = new Date(item.value.event_end);
      const eventDate = new Date(event.date);

      console.log("Checking event:", item);
      console.log(event);
      console.log("Item start:", itemStart, "Item end:", itemEnd, "Event date:", eventDate);
      if (itemStart <= eventDate && eventDate <= itemEnd) {
        foundEvent.push(item);
        console.log("Found event:", item);
      }
    }

    console.log("Finding event:", event);
    return new Response(
      JSON.stringify(foundEvent),
      { status: 200 }
    );
  }


  // イベント追加処理
  if (req.method === "POST" && pathname === "/add-event") {
    const event = await req.json();
    const cookie = req.headers.get("cookie") || "";
    const username = (() => {
      const match = cookie.match(/username=([^;]+)/);
      return match ? decodeURIComponent(match[1]) : "default";
    })();
    const myUUID = crypto.randomUUID();

    kv.set(["event", username, myUUID], event);
    return new Response(JSON.stringify({ message: "イベント追加成功" }), { status: 200 });
  }

  // イベント全件取得
  if (req.method === "POST" && pathname === "/getAllEvents") {
    const cookie = req.headers.get("cookie") || "";
    const username = (() => {
      const match = cookie.match(/username=([^;]+)/);
      return match ? decodeURIComponent(match[1]) : "default";
    })();
    console.log(`Fetching all events for user: ${username}`);
    const listResult = await kv.list({ prefix: ["event" , username]});
    const events = [];
    for await (const item of listResult) {
      events.push(item);
    }
    return new Response(JSON.stringify(events), { status: 200 });
  }

  // イベント削除処理
  if (req.method === "POST" && pathname === "/delete-event") {
    const { id } = await req.json();
    await kv.delete(["event", id]);
    return new Response(JSON.stringify({ message: "イベント削除成功" }), { status: 200 });
  }


  // ユーザー登録処理
  if (req.method === "POST" && pathname === "/api/register") {
    const { username, password } = await req.json();
    if (!username || !password) {
      return new Response(JSON.stringify({ message: "ユーザー名とパスワードは必須です" }), { status: 400 });
    }
    // 既存ユーザー確認
    const userKey = ["user", username];
    const user = await kv.get(userKey);
    if (user.value) {
      return new Response(JSON.stringify({ message: "このユーザー名は既に登録されています" }), { status: 409 });
    }
    // ユーザー登録
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    await kv.set(userKey, { username, password: hashHex });
    return new Response(JSON.stringify({ message: "ユーザー登録成功" }), { status: 201 });
  }
  

  // 認証処理
  if (req.method === "POST" && pathname === "/api/login") {
    const { username, password } = await req.json();
    const user = await kv.get(["user", username]);

    if (!user || !user.value) {
      return new Response(JSON.stringify({ message: "認証に失敗しました" }), { status: 401 });
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    if (user.value.password !== hashHex) {
      return new Response(JSON.stringify({ message: "認証に失敗しました" }), { status: 401 });
    }

    return new Response(JSON.stringify({ message: "ログイン成功", id: user.id }), { status: 200 });
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
