import { assertEquals } from "@std/assert/equals";
import { HợpĐồng, KỳPhí, lấyChuKỳ } from "./Kiểu.ts";

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

function newFunction({ tổngPhí, cácLầnThiếtLậpPhí }: HợpĐồng) {
  let i = 0;
  for (const thiếtLậpPhí of cácLầnThiếtLậpPhí) {
    const { ngàyThiếtLập, sốTiềnMỗiKỳ } = thiếtLậpPhí;
    const kếHoạchĐóngPhí: KỳPhí[] = [];
    const chuKỳ = lấyChuKỳ(thiếtLậpPhí);
    if (i === 0) {
      let ngàyĐóng = ngàyThiếtLập;
      let tổngSốPhíHoànThành = sốTiềnMỗiKỳ;
      while (tổngSốPhíHoànThành <= tổngPhí) {
        kếHoạchĐóngPhí.push({
          ngàyĐóng: ngàyĐóng,
          phíĐóng: sốTiềnMỗiKỳ,
          tổngSốPhíHoànThành: tổngSốPhíHoànThành,
        });

        ngàyĐóng = ngàyĐóng.add(chuKỳ);
        tổngSốPhíHoànThành += sốTiềnMỗiKỳ;
      }
    } else {
      const thiếtLậpPhíCũ = cácLầnThiếtLậpPhí[i - 1];
      const kỳPhíTrướcNgàyThiếtLậpMới = thiếtLậpPhíCũ.kếHoạchĐóngPhí?.findLast(({ ngàyĐóng }) =>
        Temporal.PlainDate.compare(ngàyĐóng, ngàyThiếtLập) < 0
      )!;
      const chuKỳCũ = lấyChuKỳ(thiếtLậpPhíCũ);
      const ngàyÁpDụngThiếtLậpPhíMới = kỳPhíTrướcNgàyThiếtLậpMới.ngàyĐóng.add(chuKỳCũ);

      let ngàyĐóng = ngàyÁpDụngThiếtLậpPhíMới;
      let tổngSốPhíHoànThành = kỳPhíTrướcNgàyThiếtLậpMới.tổngSốPhíHoànThành + sốTiềnMỗiKỳ;
      while (true) {
        if (tổngSốPhíHoànThành <= tổngPhí) {
          kếHoạchĐóngPhí.push({
            ngàyĐóng: ngàyĐóng,
            phíĐóng: sốTiềnMỗiKỳ,
            tổngSốPhíHoànThành: tổngSốPhíHoànThành,
          });

          ngàyĐóng = ngàyĐóng.add(chuKỳ);
          tổngSốPhíHoànThành += sốTiềnMỗiKỳ;
        } else {
          const tổngSốPhíHoànThànhkỳTrước = kếHoạchĐóngPhí.at(-1)?.tổngSốPhíHoànThành!;
          const phíĐóng = tổngPhí - tổngSốPhíHoànThànhkỳTrước;
          console.log(i, phíĐóng);
          kếHoạchĐóngPhí.push({
            ngàyĐóng: ngàyĐóng,
            phíĐóng: phíĐóng,
            tổngSốPhíHoànThành: tổngPhí,
          });
          break;
        }
      }
    }
    Object.assign(thiếtLậpPhí, { kếHoạchĐóngPhí: kếHoạchĐóngPhí });
    i++;
  }
}
newFunction(hợpĐồng);
console.log(hợpĐồng);

//@ts-ignore:
const kếHoạchĐóngPhíCuốiCùng = hợpĐồng.cácLầnThiếtLậpPhí.at(-1)?.kếHoạchĐóngPhí;
const kỳPhíCuối = kếHoạchĐóngPhíCuốiCùng?.at(-1);
const kỳPhíÁpChót = kếHoạchĐóngPhíCuốiCùng?.at(-2);

//@ts-ignore:
assertEquals(kỳPhíCuối?.tổngSốPhíHoànThành, hợpĐồng.tổngPhí);
//@ts-ignore:
assertEquals(kỳPhíÁpChót.tổngSốPhíHoànThành + kỳPhíCuối.phíĐóng, hợpĐồng.tổngPhí);
