import { assertEquals } from "@std/assert/equals";
import { HợpĐồng, KỳPhí } from "../Hàm hỗ trợ/Kiểu.ts";
import { tínhKếHoạchĐóngPhí } from "./Định kỳ đóng phí.ts";
const hợpĐồng = {
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
} satisfies HợpĐồng;
tínhKếHoạchĐóngPhí(hợpĐồng);
console.log(hợpĐồng);

//@ts-ignore:
const kếHoạchĐóngPhíCuốiCùng = hợpĐồng.cácLầnThiếtLậpPhí.at(-1)?.kếHoạchĐóngPhí as KỳPhí[];
const kỳPhíCuối = kếHoạchĐóngPhíCuốiCùng?.at(-1) as KỳPhí;
const kỳPhíÁpChót = kếHoạchĐóngPhíCuốiCùng?.at(-2) as KỳPhí;

assertEquals(kỳPhíÁpChót.tổngSốPhíHoànThành + kỳPhíCuối.phíĐóng, hợpĐồng.tổngPhí);
assertEquals(kỳPhíCuối?.tổngSốPhíHoànThành, hợpĐồng.tổngPhí);
