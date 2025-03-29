import { ResBody } from "./Code hỗ trợ/Kiểu cho client và server.ts";
import { HợpĐồngThiếtLậpPhí, HợpĐồngVậtThểPhí } from "./Code chính/Hợp đồng.ts";

/** Cái nào phải dùng Temporal để tính thì cho vào đây */
Deno.serve(async (req) => {
  const body = await req.text();
  if (body) {
    try {
      const hợpĐồngThiếtLậpPhí = JSON.parse(body) as HợpĐồngThiếtLậpPhí;
      const hợpĐồngVậtThểPhí = new HợpĐồngVậtThểPhí(hợpĐồngThiếtLậpPhí);
      const cácKỳPhíBịBỏ = hợpĐồngVậtThểPhí.cácKỳPhíBịBỏ();

      const resBody: ResBody = {
        hợpĐồngVậtThểPhí: hợpĐồngVậtThểPhí,
        cácKỳPhíBịBỏ: cácKỳPhíBịBỏ,
      };
      console.log("🚀 ~ cácKỳPhíBịBỏ:", cácKỳPhíBịBỏ);
      return new Response(JSON.stringify(resBody, null, 2), {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify(error), {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    }
  }
  return new Response("OK", {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
});
