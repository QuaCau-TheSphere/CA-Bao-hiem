import { HợpĐồngVậtThểPhí } from "../Hàm hỗ trợ/Kiểu.ts";

export function lấyKếHoạchĐóngPhíMới({ cácVậtThểPhí }: HợpĐồngVậtThểPhí) {
  const thiếtLậpPhíCuốiCùng = cácVậtThểPhí.slice(-1)[0];
  return thiếtLậpPhíCuốiCùng.kếHoạchĐóngPhí;
}
/**
 * Cả quá khứ lẫn tương lai dự kiến
 */

export function tínhToànBộCácKỳĐóngPhí({ cácVậtThểPhí }: HợpĐồngVậtThểPhí) {
  const thiếtLậpPhíCuốiCùng = cácVậtThểPhí.slice(-1)[0];
  const { lịchSửĐóngPhí, kếHoạchĐóngPhí } = thiếtLậpPhíCuốiCùng;
  return lịchSửĐóngPhí?.concat(kếHoạchĐóngPhí);
}
