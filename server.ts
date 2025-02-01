import { HợpĐồngFiberyReq } from "./Hàm hỗ trợ/Kiểu cho client và server.ts";
import { tínhKếHoạchĐóngPhí } from "./Tính toán thu nhập/Định kỳ đóng phí.ts";

Deno.serve(async (req) => {
  const body = await req.text();
  console.log("🚀 ~ body:", body);
  if (body) {
    try {
      const hợpĐồng = JSON.parse(body) as HợpĐồngFiberyReq;
      console.log("🚀 ~ hợpĐồng:", hợpĐồng);
      tínhKếHoạchĐóngPhí(hợpĐồng);
      console.log("🚀 ~ hợpĐồng:", hợpĐồng);
      return new Response(JSON.stringify(hợpĐồng, null, 2), {
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
