import { ChuKỳ, NgàyThiếtLập, NgàyĐóng } from "./Hàm và kiểu cho thời gian.ts";

export type SốTiền = number;

export interface KỳPhí {
  ngàyĐóng: NgàyĐóng;
  phíĐóng: SốTiền;
  tổngSốPhíHoànThành: SốTiền;
}

/**
 * Mỗi lần thiết lập phí thì sẽ tạo ra một vật thể phí
 * Kế hoạch đóng phí là những kỳ phí sau ngày thiết lập phí có hiệu lực
 * Ngày đóng phí đầu tiên của thiết lập phí kỳ này là ngày sử dụng hết số tiền đã đóng của kỳ phí trước đó. Nó là kỳ phí cuối cùng của thiết lập cũ
 */
export interface VậtThểPhí {
  ngàyThiếtLập: NgàyThiếtLập;
  chuKỳ: ChuKỳ;
  sốTiềnMỗiKỳ: SốTiền;
  kếHoạchĐóngPhí?: KỳPhí[];
}

export interface HợpĐồng {
  tổngPhí: SốTiền;
  cácLầnThiếtLậpPhí: VậtThểPhí[];
}
