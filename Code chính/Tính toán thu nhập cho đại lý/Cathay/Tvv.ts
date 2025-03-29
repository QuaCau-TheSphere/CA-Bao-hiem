import { hômNay, Năm, Quý } from "../../../Code hỗ trợ/Hàm và kiểu cho thời gian.ts";
import { HợpĐồngVậtThểPhí } from "../../Hợp đồng.ts";
import { Thưởng } from "./Chính sách cho PSA.ts";

export type HợpĐồng = HợpĐồngVậtThểPhí;

/**
 * Dùng lịch Georgian, chứ không dùng lịch Cathay
 * @see Thưởng
 */
export class TvvCathay {
  readonly ngàyCấpCode: Temporal.PlainDate;
  readonly ngàyBáoDanh: Temporal.PlainDate;
  dsHợpĐồng: HợpĐồng[];
  dsThưởng: Thưởng[];

  constructor(ngàyCấpCode: Temporal.PlainDate = hômNay, ngàyBáoDanh: Temporal.PlainDate = hômNay) {
    this.ngàyCấpCode = ngàyCấpCode;
    this.ngàyBáoDanh = ngàyBáoDanh;
    this.dsHợpĐồng = [];
    this.dsThưởng = [];
  }

  thêmHợpĐồng(hợpĐồngMới: HợpĐồng) {
    this.dsHợpĐồng.push(hợpĐồngMới);
  }

  dsHợpĐồngTrongQuý(quý: Quý, năm: Năm) {
    function làHợpĐồngTrongQuý(hợpĐồng: HợpĐồng) {
      const kỳPhíĐầuTiên = hợpĐồng.toànBộCácKỳĐóngPhí()[0];
      if (kỳPhíĐầuTiên.ngàyĐóng) return true;
    }
    return this.dsHợpĐồng.filter(làHợpĐồngTrongQuý);
  }

  thêmThưởng(thưởngMới: Thưởng) {
    this.dsThưởng.push(thưởngMới);
  }

  sốTlv(ngàyXét: Temporal.PlainDate = hômNay): number {
    const sốNgàyLàmViệc = ngàyXét.since(this.ngàyBáoDanh).days;
    return Math.floor(sốNgàyLàmViệc / 28);
  }

  /** Xem coi chức vụ của tvv là gì theo ngày */
  chứcVụ(ngàyXét: Temporal.PlainDate = hômNay) {
    const sốTlvKểTừNgàyXét = this.sốTlv(ngàyXét);
    if (sốTlvKểTừNgàyXét <= 26) return "PSA" as const;
    return "Toàn thời gian" as const;
  }

  chínhSáchThuNhập(ngàyXét: Temporal.PlainDate = hômNay) {
    const chứcVụ = this.chứcVụ(ngàyXét);
    if (chứcVụ === "PSA") return ["Chính sách người mới (PSA)", "Chính sách thu nhập tư vấn viên toàn thời gian"];
    return ["Chính sách thu nhập tư vấn viên toàn thời gian"];
  }
}
