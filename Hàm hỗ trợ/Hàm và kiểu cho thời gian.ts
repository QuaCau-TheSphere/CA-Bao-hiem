import { ThiếtLậpPhí } from "./Kiểu cho hợp đồng và phí.ts";

/**
 * Đúng ra chỉ cần dùng Temporal là được. Vấn đề là Fibery dùng Node 12. Node 12 thì không có Temporal, nên phải bundle với polyfill của nó. Nhưng nếu làm vậy thì script lại quá lớn, Fibery không chịu. Nên mới chấp nhận dùng dạng ISO.
 */
export type NgàyĐóng = Temporal.PlainDate | string;
export type NgàyThiếtLập = Temporal.PlainDate | string;
export type ChuKỳ = "tháng" | "quý" | "nửa năm" | "năm";
export type Quý = 1 | 2 | 3 | 4;

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

/**
 * Kết quả khi:
 * - ngày 1 trước ngày 2: -1
 * - ngày 1 trùng ngày 2: 0
 * - ngày 1 sau ngày 2: 1
 */
export function soSánhNgày(ngày1: NgàyĐóng, ngày2: NgàyThiếtLập) {
  return Temporal.PlainDate.compare(ngày1, ngày2);
}

export const hômNay = Temporal.Now.plainDateISO();
