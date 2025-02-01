import { HợpĐồng, KỳPhí, VậtThểPhí } from "../Hàm hỗ trợ/Kiểu.ts";
import { lấyChuKỳ, NgàyThiếtLập } from "../Hàm hỗ trợ/Hàm và kiểu cho thời gian.ts";
import { HợpĐồngFiberyReq } from "../Hàm hỗ trợ/Kiểu cho client và server.ts";

/**
 * @example Giả sử ngày 1/1/2025 khách hàng thiết lập chu kỳ phí là quý và đã đóng kỳ đầu tiên. Ngày 1/2 đổi chu kỳ quý sang năm. Vì đã đóng kỳ đầu tiên nên thiết lập này phải tới ngày 1/4 mới có hiệu lực. Nhưng tới ngày 1/3 lại đổi sang nửa năm. Thì code phải xác định được là kỳ phí đóng gần nhất thuộc thiết lập đầu tiên chứ không phải thứ hai.
 */
function xácĐịnhKỳPhíĐãĐóngGầnNhất(cácThiếtLậpCũ: VậtThểPhí[], ngàyThiếtLập: NgàyThiếtLập) {
  for (const thiếtLập of cácThiếtLậpCũ.toReversed()) {
    const kỳPhíTrướcNgàyThiếtLậpMới = thiếtLập.kếHoạchĐóngPhí?.findLast(({ ngàyĐóng }) => Temporal.PlainDate.compare(ngàyĐóng, ngàyThiếtLập) < 0);
    if (!kỳPhíTrướcNgàyThiếtLậpMới) continue;
    const chuKỳCũ = lấyChuKỳ(thiếtLập);
    return { kỳPhíTrướcNgàyThiếtLậpMới, chuKỳCũ };
  }
  return {};
}

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
      const cácThiếtLậpCũ = cácLầnThiếtLậpPhí.slice(0, i);
      const { kỳPhíTrướcNgàyThiếtLậpMới, chuKỳCũ } = xácĐịnhKỳPhíĐãĐóngGầnNhất(cácThiếtLậpCũ, ngàyThiếtLập);
      if (!kỳPhíTrướcNgàyThiếtLậpMới || !chuKỳCũ) continue;
      const ngàyĐóngGầnNhất = Temporal.PlainDate.from(kỳPhíTrướcNgàyThiếtLậpMới.ngàyĐóng);
      const ngàyÁpDụngThiếtLậpPhíMới = ngàyĐóngGầnNhất.add(chuKỳCũ);

      let ngàyĐóng = ngàyÁpDụngThiếtLậpPhíMới;
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
