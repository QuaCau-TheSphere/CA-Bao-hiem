import { soSánhNgày } from "../Code hỗ trợ/Hàm và kiểu cho thời gian.ts";
import { VậtThểPhí } from "./Vật thể phí.ts";

export class HợpĐồngThiếtLậpPhí {
  tênHợpĐồng?: string;
  tổngPhí: SốTiền;
  cácLầnThiếtLậpPhí: ThiếtLậpPhí[];

  constructor(tổngPhí: SốTiền, cácLầnThiếtLậpPhí: ThiếtLậpPhí[], tênHợpĐồng: string | undefined = undefined) {
    this.tênHợpĐồng = tênHợpĐồng;
    this.tổngPhí = tổngPhí;
    this.cácLầnThiếtLậpPhí = cácLầnThiếtLậpPhí;
  }
}

export interface HợpĐồngVậtThểPhí {
  tênHợpĐồng?: string;
  tổngPhí: SốTiền;
  cácVậtThểPhí: VậtThểPhí[];
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
  toànBộCácKỳĐóngPhí() {
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
