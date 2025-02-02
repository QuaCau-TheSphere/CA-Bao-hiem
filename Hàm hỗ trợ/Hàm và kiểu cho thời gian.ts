import { ThiếtLậpPhí } from "./Kiểu.ts";

/**
 * Đúng ra chỉ cần dùng Temporal là được. Vấn đề là Fibery dùng Node 12. Node 12 thì không có Temporal, nên phải bundle với polyfill của nó. Nhưng nếu làm vậy thì script lại quá lớn, Fibery không chịu. Nên mới chấp nhận dùng dạng ISO.
 */
export type NgàyĐóng = Temporal.PlainDate | string;
export type NgàyThiếtLập = Temporal.PlainDate | string;
export type ChuKỳ = "tháng" | "quý" | "nửa năm" | "năm";

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

export function soSánhNgày(ngày1: NgàyĐóng, ngày2: NgàyThiếtLập) {
  return Temporal.PlainDate.compare(ngày1, ngày2) < 0;
}
