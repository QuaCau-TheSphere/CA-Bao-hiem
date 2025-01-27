type ChuKỳ = "tháng" | "quý" | "nửa năm" | "năm";
type NgàyĐóng = Temporal.PlainDate;
type NgàyThiếtLập = Temporal.PlainDate;
type SốTiền = number;

export interface KỳPhí {
  ngàyĐóng: NgàyĐóng;
  phíĐóng: SốTiền;
  tổngSốPhíHoànThành: SốTiền;
}

/**
 * Kế hoạch đóng phí là những kỳ phí sau ngày thiết lập phí có hiệu lực
 * Ngày đóng phí đầu tiên của thiết lập phí kỳ này là ngày sử dụng hết số tiền đã đóng của kỳ phí trước đó. Nó là kỳ phí cuối cùng của thiết lập cũ
 */
interface ThiếtLậpPhí {
  ngàyThiếtLập: NgàyThiếtLập;
  chuKỳ: ChuKỳ;
  sốTiềnMỗiKỳ: SốTiền;
  kếHoạchĐóngPhí?: KỳPhí[];
}

export interface HợpĐồng {
  tổngPhí: SốTiền;
  cácLầnThiếtLậpPhí: ThiếtLậpPhí[];
}

const seedDanhMụcChuKỳ = [
  ["tháng", Temporal.Duration.from({ months: 1 })],
  ["quý", Temporal.Duration.from({ months: 3 })],
  ["nửa năm", Temporal.Duration.from({ months: 6 })],
  ["năm", Temporal.Duration.from({ years: 1 })],
] as const;
const danhMụcChuKỳ = new Map([...seedDanhMụcChuKỳ]);
export function lấyChuKỳ({ chuKỳ }: ThiếtLậpPhí) {
  const chuKỳMặcĐịnh = danhMụcChuKỳ.get("năm")!;
  return danhMụcChuKỳ.get(chuKỳ) || chuKỳMặcĐịnh;
}
