import { VậtThểPhí } from "./Kiểu.ts";
import { VậtThểPhíFibery } from "./Kiểu cho client và server.ts";

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

export function lấyChuKỳ({ chuKỳ }: VậtThểPhí | VậtThểPhíFibery) {
  const chuKỳMặcĐịnh = danhMụcChuKỳ.get("năm")!;
  return danhMụcChuKỳ.get(chuKỳ) || chuKỳMặcĐịnh;
}
