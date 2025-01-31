Deno.serve(async (req) => {
  const body = JSON.parse(await req.text());
  console.log("Body:", body);

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
});
