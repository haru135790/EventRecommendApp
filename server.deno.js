import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

Deno.serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);

  const kv = await Deno.openKv();

  // イベント検索処理
  if (req.method === "POST" && pathname === "/find-event") {
    const event = await req.json();
    const listResult = await kv.list({ prefix: ["event"] });
    const foundEvent = [];

    for await (const item of listResult) {

      const itemStart = new Date(item.value.event_start);
      const itemEnd = new Date(item.value.event_end);
      const eventDate = new Date(event.date);

      console.log("Checking event:", item.value);
      console.log(event);
      console.log("Item start:", itemStart, "Item end:", itemEnd, "Event date:", eventDate);
      if (itemStart <= eventDate && eventDate <= itemEnd) {
        foundEvent.push(item.value);
        console.log("Found event:", item.value);
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
    const myUUID = crypto.randomUUID();

    kv.set(["event", myUUID], event);
    return new Response(JSON.stringify({ message: "イベント追加成功" }), { status: 200 });
  }

  // イベント全件取得
  if (req.method === "POST" && pathname === "/getAllEvents") {
    const listResult = await kv.list({ prefix: ["event"] });
    const events = [];
    for await (const item of listResult) {
      events.push(item);
    }
    return new Response(JSON.stringify(events), { status: 200 });
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
