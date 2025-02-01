import { assertEquals, assertThrows } from "@std/assert";
import { HợpĐồng, KỳPhí } from "../Hàm hỗ trợ/Kiểu.ts";
import { tínhKếHoạchĐóngPhí } from "./Định kỳ đóng phí.ts";
const dsHợpĐồng: HợpĐồng[] = [
  {
    tổngPhí: 3e6,
    cácLầnThiếtLậpPhí: [
      {
        ngàyThiếtLập: new Temporal.PlainDate(2025, 1, 1),
        chuKỳ: "năm",
        sốTiềnMỗiKỳ: 1e5,
      },
      {
        ngàyThiếtLập: new Temporal.PlainDate(2025, 9, 1),
        chuKỳ: "quý",
        sốTiềnMỗiKỳ: 2e5,
      },
      {
        ngàyThiếtLập: new Temporal.PlainDate(2026, 9, 1),
        chuKỳ: "nửa năm",
        sốTiềnMỗiKỳ: 2.5e5,
      },
    ],
  },
  {
    "tổngPhí": 30000000,
    "cácLầnThiếtLậpPhí": [
      {
        "ngàyThiếtLập": "2025-01-01",
        "chuKỳ": "quý",
        "sốTiềnMỗiKỳ": 300000,
      },
      {
        "ngàyThiếtLập": "2025-04-01",
        "chuKỳ": "năm",
        "sốTiềnMỗiKỳ": 300000,
      },
      {
        "ngàyThiếtLập": "2025-04-02",
        "chuKỳ": "quý",
        "sốTiềnMỗiKỳ": 400000,
      },
    ],
  },
];

const hợpĐồngLỗi = {
  "tổngPhí": 30000000,
  "cácLầnThiếtLậpPhí": [
    {
      "ngàyThiếtLập": "2025-02-01",
      "chuKỳ": "quý",
      "sốTiềnMỗiKỳ": 300000,
    },
    {
      "ngàyThiếtLập": "2025-04-01",
      "chuKỳ": "năm",
      "sốTiềnMỗiKỳ": 300000,
    },
    {
      "ngàyThiếtLập": "2025-04-02",
      "chuKỳ": "quý",
      "sốTiềnMỗiKỳ": 400000,
    },
  ],
};

for (const i in dsHợpĐồng) {
  let hợpĐồng = dsHợpĐồng[i];
  Deno.test(`Hợp đồng ${i}`, function () {
    const { kỳPhíÁpChót, kỳPhíCuối } = kiểmTraKếtQuả(hợpĐồng);
    assertEquals(kỳPhíÁpChót.tổngSốPhíHoànThành + kỳPhíCuối.phíĐóng, hợpĐồng.tổngPhí);
    assertEquals(kỳPhíCuối?.tổngSốPhíHoànThành, hợpĐồng.tổngPhí);
  });
}
// Deno.test(`Hợp đồng lỗi`, function () {
//   assertThrows(newFunction()); // Doesn't throw
//   // assertThrows(tínhKếHoạchĐóngPhí(hợpĐồngLỗi));
// });

// function newFunction(): () => unknown {

//   return () => { throw new TypeError("hello world!"); };
// }

// Deno.test("Ngày thiết lập phí lần sau phải sau lần trước", function () {
//   newFunction(hợpĐồng2);
// });

function kiểmTraKếtQuả(hợpĐồng: HợpĐồng) {
  tínhKếHoạchĐóngPhí(hợpĐồng);
  const kếHoạchĐóngPhíCuốiCùng = hợpĐồng.cácLầnThiếtLậpPhí.at(-1)?.kếHoạchĐóngPhí as KỳPhí[];
  const kỳPhíCuối = kếHoạchĐóngPhíCuốiCùng?.at(-1) as KỳPhí;
  const kỳPhíÁpChót = kếHoạchĐóngPhíCuốiCùng?.at(-2) as KỳPhí;
  return { kỳPhíÁpChót, kỳPhíCuối };
}
