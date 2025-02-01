import { HợpĐồngFiberyReq } from "./Hàm hỗ trợ/Kiểu cho client và server.ts";
import { tínhKếHoạchĐóngPhí } from "./Tính toán thu nhập/Định kỳ đóng phí.ts";

Deno.serve(async (req) => {
  const body = await req.text();
  if (body) {
    const hợpĐồng = JSON.parse(body) as HợpĐồngFiberyReq;
    tínhKếHoạchĐóngPhí(hợpĐồng);
    return new Response(JSON.stringify(hợpĐồng, null, 2), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }
  return new Response("OK", {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
});
