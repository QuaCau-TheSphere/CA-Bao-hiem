import { ChuKỳ, NgàyThiếtLập, NgàyĐóng } from "./Hàm và kiểu cho thời gian.ts";

export type SốTiền = number;

export interface KỳPhí {
  ngàyĐóng: NgàyĐóng;
  phíĐóng: SốTiền;
  tổngSốPhíHoànThành: SốTiền;
  ngàyĐóngKếTiếp: NgàyĐóng | null;
}

/**
 * Mỗi lần thiết lập phí thì sẽ tạo ra một vật thể thiết lập phí. Thiết lập phí là những thứ người dùng thiết lập. Vật thể phí là kết quả tính toán từ các thiết lập đó
 * Tất cả những thứ trong đây nên chấp nhận string hoặc number, vì nó sẽ được truyền vào request
 */
export interface ThiếtLậpPhí {
  ngàyThiếtLập: NgàyThiếtLập;
  chuKỳ: ChuKỳ;
  sốTiềnMỗiKỳ: SốTiền;
}

/**
 * Kế hoạch đóng phí là những kỳ phí sau ngày thiết lập phí có hiệu lực
 * Ngày đóng phí đầu tiên của thiết lập phí kỳ này là ngày sử dụng hết số tiền đã đóng của kỳ phí trước đó. Nó là kỳ phí cuối cùng của thiết lập cũ
 * @property lịchSửĐóngPhí tất cả các kỳ phí đã đóng cho tới trước thời điểm thiết lập. Nếu là thiết lập phí đầu tiên thì nó là mảng rỗng
 * @property kếHoạchĐóngPhí tất cả các kỳ phí dự định sẽ đóng với thiết lập này
 */
export interface VậtThểPhí extends ThiếtLậpPhí {
  lịchSửĐóngPhí: KỳPhí[];
  kếHoạchĐóngPhí: KỳPhí[];
}

export interface HợpĐồngThiếtLậpPhí {
  tênHợpĐồng?: string;
  tổngPhí: SốTiền;
  cácLầnThiếtLậpPhí: ThiếtLậpPhí[];
}

export interface HợpĐồngVậtThểPhí {
  tênHợpĐồng?: string;
  tổngPhí: SốTiền;
  cácVậtThểPhí: VậtThểPhí[];
}
