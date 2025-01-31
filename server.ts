Deno.serve(async (req) => {
  const body = await req.text();
  if (body) {
    const res = { b: 2 };
    return new Response(JSON.stringify(res, null, 2), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }
  return new Response("OK", {
    status: 200,
    headers: {
      "content-type": "application/text; charset=utf-8",
    },
  });
});
