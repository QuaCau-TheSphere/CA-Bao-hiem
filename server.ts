import { HợpĐồngThiếtLậpPhí, HợpĐồngVậtThểPhí } from "./Tính toán thu nhập/Hàm hỗ trợ/Kiểu.ts";
import { xácĐịnhCácKỳPhíBịBỏ } from "./Tính toán thu nhập/Xử lý vật thể phí.ts";
import { tạoVậtThểPhí } from "./Tính toán thu nhập/Tạo vật thể phí.ts";
import { ResBody } from "./Tính toán thu nhập/Hàm hỗ trợ/Kiểu cho client và server.ts";

function lấyKếHoạchĐóngPhíMới({ cácVậtThểPhí }: HợpĐồngVậtThểPhí) {
  const vậtThểPhíCuốiCùng = cácVậtThểPhí.at(-1)!;
  return vậtThểPhíCuốiCùng.kếHoạchĐóngPhí;
}

/** Cái nào phải dùng Temporal để tính thì cho vào đây */
Deno.serve(async (req) => {
  const body = await req.text();
  if (body) {
    try {
      const hợpĐồngThiếtLậpPhí = JSON.parse(body) as HợpĐồngThiếtLậpPhí;
      const hợpĐồngVậtThểPhí = tạoVậtThểPhí(hợpĐồngThiếtLậpPhí);
      console.log(hợpĐồngVậtThểPhí);

      const kếHoạchĐóngPhí = lấyKếHoạchĐóngPhíMới(hợpĐồngVậtThểPhí);
      const cácKỳPhíBịBỏ = xácĐịnhCácKỳPhíBịBỏ(kếHoạchĐóngPhí);

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
