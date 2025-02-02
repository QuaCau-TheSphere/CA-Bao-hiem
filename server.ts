import { HợpĐồngThiếtLậpPhí } from "./Hàm hỗ trợ/Kiểu.ts";
import { tạoVậtThểPhí } from "./Tính toán thu nhập/Tạo vật thể phí.ts";

Deno.serve(async (req) => {
  const body = await req.text();
  if (body) {
    try {
      const hợpĐồngThiếtLậpPhí = JSON.parse(body) as HợpĐồngThiếtLậpPhí;
      const hợpĐồngVậtThểPhí = tạoVậtThểPhí(hợpĐồngThiếtLậpPhí);
      console.log(hợpĐồngVậtThểPhí);
      return new Response(JSON.stringify(hợpĐồngVậtThểPhí, null, 2), {
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
