import { assertEquals } from "@std/assert";
import { HợpĐồngThiếtLậpPhí, HợpĐồngVậtThểPhí, KỳPhí } from "../Hàm hỗ trợ/Kiểu.ts";
import { tạoVậtThểPhí } from "./Tạo vật thể phí.ts";
import { lấyKếHoạchĐóngPhíMới } from "./Xử lý vật thể phí.ts";
const dsHợpĐồng: HợpĐồngThiếtLậpPhí[] = [
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

for (const i in dsHợpĐồng) {
  if (i === "0") continue;
  const hợpĐồngThiếtLậpPhí = dsHợpĐồng[i];
  Deno.test(`Hợp đồng ${i}`, () => {
    const hợpĐồngVậtThểPhí = tạoVậtThểPhí(hợpĐồngThiếtLậpPhí);
    kiểmTraKếtQuả(hợpĐồngVậtThểPhí);
    // console.log("🚀 ~ hợpĐồng:", hợpĐồng);
    // console.log(lấyKếHoạchĐóngPhíMới(hợpĐồng));
  });
}

export function kiểmTraKếtQuả(hợpĐồng: HợpĐồngVậtThểPhí) {
  const kếHoạchĐóngPhíCuốiCùng = hợpĐồng.cácVậtThểPhí.at(-1)?.kếHoạchĐóngPhí as KỳPhí[];
  const kỳPhíCuối = kếHoạchĐóngPhíCuốiCùng?.at(-1) as KỳPhí;
  const kỳPhíÁpChót = kếHoạchĐóngPhíCuốiCùng?.at(-2) as KỳPhí;
  assertEquals(kỳPhíÁpChót.tổngSốPhíHoànThành + kỳPhíCuối.phíĐóng, hợpĐồng.tổngPhí);
  assertEquals(kỳPhíCuối?.tổngSốPhíHoànThành, hợpĐồng.tổngPhí);
}
