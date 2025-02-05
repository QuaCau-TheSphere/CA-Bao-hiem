import { soSánhNgày } from "../Hàm hỗ trợ/Hàm và kiểu cho thời gian.ts";
import { HợpĐồngVậtThểPhí, KỳPhí } from "../Hàm hỗ trợ/Kiểu.ts";

export function lấyKếHoạchĐóngPhíMới({ cácVậtThểPhí }: HợpĐồngVậtThểPhí) {
  const vậtThểPhíCuốiCùng = cácVậtThểPhí.slice(-1)[0];
  return vậtThểPhíCuốiCùng.kếHoạchĐóngPhí;
}

/**
 * Cả quá khứ lẫn tương lai dự kiến
 */
export function tínhToànBộCácKỳĐóngPhí({ cácVậtThểPhí }: HợpĐồngVậtThểPhí) {
  const thiếtLậpPhíCuốiCùng = cácVậtThểPhí.slice(-1)[0];
  const { lịchSửĐóngPhí, kếHoạchĐóngPhí } = thiếtLậpPhíCuốiCùng;
  return lịchSửĐóngPhí?.concat(kếHoạchĐóngPhí);
}

export const hômNay = Temporal.Now.plainDateISO();

export function xácĐịnhCácKỳPhíBịBỏ(kếHoạchĐóngPhí: KỳPhí[]) {
  return kếHoạchĐóngPhí.filter(({ ngàyĐóng }) => soSánhNgày(ngàyĐóng, hômNay) > 0);
}
