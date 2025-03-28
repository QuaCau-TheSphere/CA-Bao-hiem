import { HợpĐồngThiếtLậpPhí, KỳPhí, SốTiền } from "../../Hàm hỗ trợ/Kiểu cho hợp đồng và phí.ts";
import { ChuKỳ, lấyChuKỳ, NgàyThiếtLập, soSánhNgày } from "../../Hàm hỗ trợ/Hàm và kiểu cho thời gian.ts";
import { ThiếtLậpPhí } from "../../Hàm hỗ trợ/Kiểu cho hợp đồng và phí.ts";

/**
 * Tính các kỳ phí bắt đầu từ ngày mà thiết lập có hiệu lực cho tới ngày có ngày thiết lập mới
 */
function tínhCáckỳPhíĐãĐóngCủaThiếtLậpCũ({ kếHoạchĐóngPhí }: VậtThểPhí, ngàyThiếtLập: NgàyThiếtLập) {
  return kếHoạchĐóngPhí.filter(({ ngàyĐóng }) => soSánhNgày(ngàyĐóng, ngàyThiếtLập) < 0);
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

/**
 * Với mỗi thiết lập phí được khai báo sẽ tính kế hoạch đóng phí.
 *
 * Ngày đóng phí đầu tiên của thiết lập phí kỳ này là ngày sử dụng hết số tiền đã đóng của kỳ phí trước đó. Nó là kỳ phí cuối cùng của thiết lập cũ
 */

export class HợpĐồngVậtThểPhí implements HợpĐồngVậtThểPhí {
  tênHợpĐồng?: string;
  tổngPhí: SốTiền;
  cácVậtThểPhí: VậtThểPhí[];

  constructor({ tổngPhí, cácLầnThiếtLậpPhí, tênHợpĐồng }: HợpĐồngThiếtLậpPhí) {
    const cácVậtThểPhí: VậtThểPhí[] = [];
    for (const i of Object.keys(cácLầnThiếtLậpPhí).map(Number)) {
      const thiếtLậpPhí = cácLầnThiếtLậpPhí[i];
      const vậtThểPhíTrướcĐó = cácVậtThểPhí[i - 1] || null;
      const vậtThểPhí = new VậtThểPhí(tổngPhí, thiếtLậpPhí, vậtThểPhíTrướcĐó);

      cácVậtThểPhí.push(vậtThểPhí);
      const { lịchSửĐóngPhí } = vậtThểPhí;
      // console.log(i, ngàyThiếtLập, lịchSửĐóngPhí);
    }

    this.tênHợpĐồng = tênHợpĐồng;
    this.tổngPhí = tổngPhí;
    this.cácVậtThểPhí = cácVậtThểPhí;
  }

  /**
   * Cả quá khứ lẫn tương lai dự kiến
   */
  tínhToànBộCácKỳĐóngPhí() {
    const thiếtLậpPhíCuốiCùng = this.cácVậtThểPhí.slice(-1)[0];
    const { lịchSửĐóngPhí, kếHoạchĐóngPhí } = thiếtLậpPhíCuốiCùng;
    return lịchSửĐóngPhí?.concat(kếHoạchĐóngPhí);
  }

  cácKỳPhíBịBỏ(): KỳPhí[] {
    const vậtThểPhíTrướcKhiThayĐổi = this.cácVậtThểPhí.at(-2);
    console.log("🚀 ~ vậtThểPhíTrướcKhiThayĐổi:", vậtThểPhíTrướcKhiThayĐổi);
    if (!vậtThểPhíTrướcKhiThayĐổi) return [];

    const kếHoạchĐóngPhíCũ = vậtThểPhíTrướcKhiThayĐổi.kếHoạchĐóngPhí;
    console.log("🚀 ~ kếHoạchĐóngPhíCũ:", kếHoạchĐóngPhíCũ);
    const hômNay = Temporal.Now.plainDateISO();
    return kếHoạchĐóngPhíCũ.filter(({ ngàyĐóng }) => soSánhNgày(ngàyĐóng, hômNay) >= 0);
  }
}
