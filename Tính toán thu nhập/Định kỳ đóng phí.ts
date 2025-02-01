import { HợpĐồng, KỳPhí } from "../Hàm hỗ trợ/Kiểu.ts";
import { lấyChuKỳ } from "../Hàm hỗ trợ/Hàm và kiểu cho thời gian.ts";
import { HợpĐồngFiberyReq } from "../Hàm hỗ trợ/Kiểu cho client và server.ts";

/**
 * Với mỗi thiết lập phí được khai báo sẽ tính kế hoạch đóng phí.
 *
 * Ngày đóng phí đầu tiên của thiết lập phí kỳ này là ngày sử dụng hết số tiền đã đóng của kỳ phí trước đó. Nó là kỳ phí cuối cùng của thiết lập cũ
 */
export function tínhKếHoạchĐóngPhí({ tổngPhí, cácLầnThiếtLậpPhí }: HợpĐồng | HợpĐồngFiberyReq) {
  for (const i of Object.keys(cácLầnThiếtLậpPhí).map(Number)) {
    console.log(i);
    const thiếtLậpPhí = cácLầnThiếtLậpPhí[i];
    const kếHoạchĐóngPhí: KỳPhí[] = [];
    const { ngàyThiếtLập, sốTiềnMỗiKỳ } = thiếtLậpPhí;
    const chuKỳ = lấyChuKỳ(thiếtLậpPhí);
    if (i === 0) {
      let ngàyĐóng = Temporal.PlainDate.from(ngàyThiếtLập);
      console.log("🚀 ~ ngàyĐóng:", ngàyĐóng);
      console.log("🚀 ~ ngàyĐóng:", ngàyĐóng);
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
      const ngàyĐóngGầnNhất = Temporal.PlainDate.from(kỳPhíTrướcNgàyThiếtLậpMới.ngàyĐóng);
      const ngàyÁpDụngThiếtLậpPhíMới = ngàyĐóngGầnNhất.add(chuKỳCũ);

      let ngàyĐóng = ngàyÁpDụngThiếtLậpPhíMới;
      console.log("🚀 ~ ngàyĐóng:", ngàyĐóng);
      let tổngSốPhíHoànThành = kỳPhíTrướcNgàyThiếtLậpMới.tổngSốPhíHoànThành + sốTiềnMỗiKỳ;
      while (true) {
        if (tổngSốPhíHoànThành < tổngPhí) {
          kếHoạchĐóngPhí.push({
            ngàyĐóng: ngàyĐóng,
            phíĐóng: sốTiềnMỗiKỳ,
            tổngSốPhíHoànThành: tổngSốPhíHoànThành,
          });

          ngàyĐóng = ngàyĐóng.add(chuKỳ);
          tổngSốPhíHoànThành += sốTiềnMỗiKỳ;
        } else if (tổngSốPhíHoànThành === tổngPhí) {
          kếHoạchĐóngPhí.push({
            ngàyĐóng: ngàyĐóng,
            phíĐóng: sốTiềnMỗiKỳ,
            tổngSốPhíHoànThành: tổngSốPhíHoànThành,
          });
          break;
        } else {
          const tổngSốPhíHoànThànhKỳTrước = kếHoạchĐóngPhí.at(-1)?.tổngSốPhíHoànThành!;
          const phíĐóng = tổngPhí - tổngSốPhíHoànThànhKỳTrước;
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
  }
}
