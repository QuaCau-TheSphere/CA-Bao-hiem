import { ChuKỳ, lấyChuKỳ, NgàyThiếtLập, NgàyĐóng, soSánhNgày } from "../Code hỗ trợ/Hàm và kiểu cho thời gian.ts";
import { SốTiền } from "../Code hỗ trợ/Số tiền.ts";

/**
 * Tính các kỳ phí bắt đầu từ ngày mà thiết lập có hiệu lực cho tới ngày có ngày thiết lập mới
 */
function tínhCáckỳPhíĐãĐóngCủaThiếtLậpCũ({ kếHoạchĐóngPhí }: VậtThểPhí, ngàyThiếtLập: NgàyThiếtLập) {
  return kếHoạchĐóngPhí.filter(({ ngàyĐóng }) => soSánhNgày(ngàyĐóng, ngàyThiếtLập) < 0);
}
export class KỳPhí {
  ngàyĐóng: NgàyĐóng;
  phíĐóng: SốTiền;
  tổngSốPhíHoànThành: SốTiền;
  ngàyĐóngKếTiếp: NgàyĐóng | null;

  constructor(ngàyĐóng: NgàyĐóng, phíĐóng: SốTiền, tổngSốPhíHoànThành: SốTiền, ngàyĐóngKếTiếp: NgàyĐóng | null) {
    this.ngàyĐóng = ngàyĐóng;
    this.phíĐóng = phíĐóng;
    this.tổngSốPhíHoànThành = tổngSốPhíHoànThành;
    this.ngàyĐóngKếTiếp = ngàyĐóngKếTiếp;
  }
}

/**
 * Mỗi lần thiết lập phí thì sẽ tạo ra một vật thể thiết lập phí. Thiết lập phí là những thứ người dùng thiết lập. Vật thể phí là kết quả tính toán từ các thiết lập đó
 * Tất cả những thứ trong đây nên chấp nhận string hoặc number, vì nó sẽ được truyền vào request
 */
export class ThiếtLậpPhí {
  ngàyThiếtLập: NgàyThiếtLập;
  chuKỳ: ChuKỳ;
  sốTiềnMỗiKỳ: SốTiền;

  constructor(ngàyThiếtLập: NgàyThiếtLập, chuKỳ: ChuKỳ, sốTiềnMỗiKỳ: SốTiền) {
    this.ngàyThiếtLập = ngàyThiếtLập;
    this.chuKỳ = chuKỳ;
    this.sốTiềnMỗiKỳ = sốTiềnMỗiKỳ;
  }
}

export interface VậtThểPhí {
  ngàyThiếtLập: NgàyThiếtLập;
  chuKỳ: ChuKỳ;
  sốTiềnMỗiKỳ: SốTiền;
  lịchSửĐóngPhí: KỳPhí[];
  kếHoạchĐóngPhí: KỳPhí[];
}

/**
 * Kế hoạch đóng phí là những kỳ phí sau ngày thiết lập phí có hiệu lực
 * Ngày đóng phí đầu tiên của thiết lập phí kỳ này là ngày sử dụng hết số tiền đã đóng của kỳ phí trước đó. Nó là kỳ phí cuối cùng của thiết lập cũ
 * @property lịchSửĐóngPhí tất cả các kỳ phí đã đóng cho tới trước thời điểm thiết lập. Nếu là thiết lập phí đầu tiên thì nó là mảng rỗng
 * @property kếHoạchĐóngPhí tất cả các kỳ phí dự định sẽ đóng với thiết lập này
 */
export class VậtThểPhí implements VậtThểPhí {
  ngàyThiếtLập: NgàyThiếtLập;
  chuKỳ: ChuKỳ;
  sốTiềnMỗiKỳ: SốTiền;
  lịchSửĐóngPhí: KỳPhí[];
  kếHoạchĐóngPhí: KỳPhí[];

  constructor(tổngPhí: number, thiếtLậpPhí: ThiếtLậpPhí, vậtThểPhíTrướcĐó: VậtThểPhí | null) {
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
      const kỳPhíĐãĐóngTrướcNgàyThiếtLậpPhíMới = lịchSửĐóngPhí.at(-1);

      /** Nếu trước ngày thiết lập mới không có kỳ phí đã đóng nào thì nghĩa là đây cũng là thiết lập đầu tiên */
      if (kỳPhíĐãĐóngTrướcNgàyThiếtLậpPhíMới) {
        const ngàyĐóngGầnNhất = Temporal.PlainDate.from(kỳPhíĐãĐóngTrướcNgàyThiếtLậpPhíMới.ngàyĐóng);
        ngàyĐóng = ngàyĐóngGầnNhất.add(chuKỳCũ);
        tổngSốPhíHoànThành = kỳPhíĐãĐóngTrướcNgàyThiếtLậpPhíMới.tổngSốPhíHoànThành + sốTiềnMỗiKỳ;
      } else {
        //todo: kiểm tra coi lại đúng ko
        ngàyĐóng = Temporal.PlainDate.from(ngàyThiếtLập);
        tổngSốPhíHoànThành = sốTiềnMỗiKỳ;
      }
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

    this.ngàyThiếtLập = thiếtLậpPhí.ngàyThiếtLập;
    this.chuKỳ = thiếtLậpPhí.chuKỳ;
    this.sốTiềnMỗiKỳ = thiếtLậpPhí.sốTiềnMỗiKỳ;
    this.lịchSửĐóngPhí = lịchSửĐóngPhí;
    this.kếHoạchĐóngPhí = kếHoạchĐóngPhí;
  }
}
