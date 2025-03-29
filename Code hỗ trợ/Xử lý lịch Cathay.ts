/**
 * @description tlv: tháng làm việc. Cathay dùng lịch 13 tháng, mỗi tháng có đúng 28 ngày. Do 28 * 13 = 364, nên sẽ bị thiếu 1 ngày. Ngày đó Cathay quy định sẽ là ngày 1/1. Tức là ngày 2/1 sẽ là ngày 1/tlv1
 */

import { hômNay, làTemporal } from "./Hàm và kiểu cho thời gian.ts";

export type NgàyCathay = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28;
export type ThángCathay = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type TuầnTrongThángCathay = 1 | 2 | 3 | 4;

function làNgàyCathay(a: any): a is NgàyCathay {
  if (Number.isInteger(a) && a <= 28) return true;
  return false;
}

function làThángCathay(b: any): b is ThángCathay {
  if (Number.isInteger(b) && b <= 13) return true;
  return false;
}

export class TemporalCathay {
  ngày: NgàyCathay;
  tháng: ThángCathay;
  năm: number;
  tuầnTrongTháng: TuầnTrongThángCathay;

  constructor(ngàyHoặcTemporal: Temporal.PlainDate | number = hômNay, tháng: number | undefined = undefined, năm: number | undefined = undefined) {
    if (làNgàyCathay(ngàyHoặcTemporal) && làThángCathay(tháng) && Number.isInteger(năm)) {
      this.ngày = ngàyHoặcTemporal;
      this.tháng = tháng;
      this.năm = năm as number;
    } else if (làTemporal(ngàyHoặcTemporal)) {
      const { dayOfYear, year } = ngàyHoặcTemporal;
      this.ngày = dayOfYear % 28 as NgàyCathay;
      this.tháng = Math.floor(dayOfYear / 28) as ThángCathay;
      this.năm = year;
    } else {
      throw new Error("Đối số cho lớp TemporalCathay không hợp lệ");
    }

    this.tuầnTrongTháng = Math.floor(this.ngày / 7) as TuầnTrongThángCathay;
  }
}
export const hômNayCathay = new TemporalCathay();

export function làThángCathayCuốiQuý(temporalCathay: TemporalCathay = hômNayCathay) {
  const thángCathay = temporalCathay.tháng;
  const dsThángCuốiQuý = [3, 6, 9, 13];
  if (dsThángCuốiQuý.includes(thángCathay)) return true;
  return false;
}
