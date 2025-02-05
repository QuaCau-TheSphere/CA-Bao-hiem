import { HợpĐồngThiếtLậpPhí, HợpĐồngVậtThểPhí, KỳPhí, SốTiền, VậtThểPhí } from "../Hàm hỗ trợ/Kiểu.ts";
import { lấyChuKỳ, NgàyThiếtLập, soSánhNgày } from "../Hàm hỗ trợ/Hàm và kiểu cho thời gian.ts";
import { ThiếtLậpPhí } from "../Hàm hỗ trợ/Kiểu.ts";

/**
 * Tính các kỳ phí bắt đầu từ ngày mà thiết lập có hiệu lực cho tới ngày có ngày thiết lập mới
 */
function tínhCáckỳPhíĐãĐóngCủaThiếtLậpCũ({ kếHoạchĐóngPhí }: VậtThểPhí, ngàyThiếtLập: NgàyThiếtLập) {
  return kếHoạchĐóngPhí.filter(({ ngàyĐóng }) => soSánhNgày(ngàyĐóng, ngàyThiếtLập) < 0);
}

function tínhLịchSửVàKếHoạchĐóngPhí(
  vậtThểPhíTrướcĐó: VậtThểPhí | null,
  tổngPhí: SốTiền,
  thiếtLậpPhí: ThiếtLậpPhí,
) {
  const chuKỳ = lấyChuKỳ(thiếtLậpPhí);
  const { sốTiềnMỗiKỳ, ngàyThiếtLập } = thiếtLậpPhí;

  const lịchSửĐóngPhí: KỳPhí[] = [];
  const kếHoạchĐóngPhí: KỳPhí[] = [];
  let ngàyĐóng: Temporal.PlainDate;
  let tổngSốPhíHoànThành: SốTiền;

  /** Là thiết lập phí ban đầu */
  if (!vậtThểPhíTrướcĐó) {
    ngàyĐóng = Temporal.PlainDate.from(ngàyThiếtLập);
    tổngSốPhíHoànThành = sốTiềnMỗiKỳ;
  } else {
    /** Lịch sử đóng phí của vật thể phí trước đó, chứ không phải lịch sử đóng phí cho tới trước ngày thiết lập phí mới */
    const lịchSửĐóngPhíCũ = vậtThểPhíTrướcĐó.lịchSửĐóngPhí;
    const cáckỳPhíĐãĐóngCủaThiếtLậpCũ = tínhCáckỳPhíĐãĐóngCủaThiếtLậpCũ(vậtThểPhíTrướcĐó, ngàyThiếtLập);
    lịchSửĐóngPhí.push(...lịchSửĐóngPhíCũ, ...cáckỳPhíĐãĐóngCủaThiếtLậpCũ);

    const chuKỳCũ = lấyChuKỳ(vậtThểPhíTrướcĐó);
    const kỳPhíĐãĐóngTrướcNgàyThiếtLậpPhíMới = lịchSửĐóngPhí.at(-1)!;
    const ngàyĐóngGầnNhất = Temporal.PlainDate.from(kỳPhíĐãĐóngTrướcNgàyThiếtLậpPhíMới.ngàyĐóng);

    ngàyĐóng = ngàyĐóngGầnNhất.add(chuKỳCũ);
    tổngSốPhíHoànThành = kỳPhíĐãĐóngTrướcNgàyThiếtLậpPhíMới.tổngSốPhíHoànThành + sốTiềnMỗiKỳ;
  }

  while (true) {
    if (tổngSốPhíHoànThành < tổngPhí) {
      kếHoạchĐóngPhí.push({
        ngàyĐóng: ngàyĐóng,
        phíĐóng: sốTiềnMỗiKỳ,
        tổngSốPhíHoànThành: tổngSốPhíHoànThành,
        ngàyĐóngKếTiếp: ngàyĐóng,
      });

      ngàyĐóng = ngàyĐóng.add(chuKỳ);
      tổngSốPhíHoànThành += sốTiềnMỗiKỳ;
    } else if (tổngSốPhíHoànThành === tổngPhí) {
      kếHoạchĐóngPhí.push({
        ngàyĐóng: ngàyĐóng,
        phíĐóng: sốTiềnMỗiKỳ,
        tổngSốPhíHoànThành: tổngSốPhíHoànThành,
        ngàyĐóngKếTiếp: null,
      });
      break;
    } else {
      const kỳPhíÁpChót = kếHoạchĐóngPhí.at(-1)!;
      const tổngSốPhíĐãĐóng = kỳPhíÁpChót.tổngSốPhíHoànThành;
      const phíĐóngCònLại = tổngPhí - tổngSốPhíĐãĐóng;
      kếHoạchĐóngPhí.push({
        ngàyĐóng: ngàyĐóng,
        phíĐóng: phíĐóngCònLại,
        tổngSốPhíHoànThành: tổngPhí,
        ngàyĐóngKếTiếp: null,
      });
      break;
    }
  }
  return { kếHoạchĐóngPhí: kếHoạchĐóngPhí, lịchSửĐóngPhí: lịchSửĐóngPhí };
}

/**
 * Với mỗi thiết lập phí được khai báo sẽ tính kế hoạch đóng phí.
 *
 * Ngày đóng phí đầu tiên của thiết lập phí kỳ này là ngày sử dụng hết số tiền đã đóng của kỳ phí trước đó. Nó là kỳ phí cuối cùng của thiết lập cũ
 */
export function tạoVậtThểPhí({ tổngPhí, cácLầnThiếtLậpPhí }: HợpĐồngThiếtLậpPhí): HợpĐồngVậtThểPhí {
  const cácVậtThểPhí: VậtThểPhí[] = [];
  const hợpĐồngVậtThểPhí: HợpĐồngVậtThểPhí = { tổngPhí: tổngPhí, cácVậtThểPhí: cácVậtThểPhí };
  for (const i of Object.keys(cácLầnThiếtLậpPhí).map(Number)) {
    const thiếtLậpPhí = cácLầnThiếtLậpPhí[i];
    const { ngàyThiếtLập, sốTiềnMỗiKỳ, chuKỳ: chuKỳChữ } = thiếtLậpPhí;

    const vậtThểPhí: Partial<VậtThểPhí> = {
      chuKỳ: chuKỳChữ,
      ngàyThiếtLập: ngàyThiếtLập,
      sốTiềnMỗiKỳ: sốTiềnMỗiKỳ,
    };

    if (i === 0) {
      Object.assign(vậtThểPhí, tínhLịchSửVàKếHoạchĐóngPhí(null, tổngPhí, thiếtLậpPhí));
    } else {
      const vậtThểPhíTrướcĐó = cácVậtThểPhí[i - 1];
      Object.assign(vậtThểPhí, tínhLịchSửVàKếHoạchĐóngPhí(vậtThểPhíTrướcĐó, tổngPhí, thiếtLậpPhí));
    }
    cácVậtThểPhí.push(vậtThểPhí as VậtThểPhí);
    const { lịchSửĐóngPhí } = vậtThểPhí;
    // console.log(i, ngàyThiếtLập, lịchSửĐóngPhí);
  }
  return hợpĐồngVậtThểPhí;
}
