import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

Deno.serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);

  if (req.method === "GET" && pathname === "/welcome-message") {
    return new Response("jigインターンへようこそ！");
  }
  if (req.method === "POST" && pathname === "/find-event") {
    const event = await req.json();
    console.log("Finding event:", event);
    return new Response(
      JSON.stringify([{
        name: "testName",
        date: "2023-01-01",
        location: "テスト会場",
      }]),
      { status: 200 }
    );
  }
  if (req.method === "POST" && pathname === "/add-event") {
    const event = await req.json();
    console.log("Adding event:", event);
    return new Response(JSON.stringify({ message: "イベント追加成功" }), { status: 200 });
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
