import { ChuKỳ, NgàyThiếtLập, NgàyĐóng } from "./Hàm và kiểu cho thời gian.ts";

export type SốTiền = number;

export class KỳPhí {
  ngàyĐóng: NgàyĐóng;
  phíĐóng: SốTiền;
  tổngSốPhíHoànThành: SốTiền;
  ngàyĐóngKếTiếp: NgàyĐóng | null;

  constructor(ngàyĐóng: NgàyĐóng, phíĐóng: SốTiền, tổngSốPhíHoànThành: SốTiền, ngàyĐóngKếTiếp: NgàyĐóng | null) {
    this.ngàyĐóng = ngàyĐóng;
    this.phíĐóng = phíĐóng;
    this.tổngSốPhíHoànThành = tổngSốPhíHoànThành;
    this.ngàyĐóngKếTiếp = ngàyĐóngKếTiếp;
  }
}

/**
 * Mỗi lần thiết lập phí thì sẽ tạo ra một vật thể thiết lập phí. Thiết lập phí là những thứ người dùng thiết lập. Vật thể phí là kết quả tính toán từ các thiết lập đó
 * Tất cả những thứ trong đây nên chấp nhận string hoặc number, vì nó sẽ được truyền vào request
 */
export class ThiếtLậpPhí {
  ngàyThiếtLập: NgàyThiếtLập;
  chuKỳ: ChuKỳ;
  sốTiềnMỗiKỳ: SốTiền;

  constructor(ngàyThiếtLập: NgàyThiếtLập, chuKỳ: ChuKỳ, sốTiềnMỗiKỳ: SốTiền) {
    this.ngàyThiếtLập = ngàyThiếtLập;
    this.chuKỳ = chuKỳ;
    this.sốTiềnMỗiKỳ = sốTiềnMỗiKỳ;
  }
}

export class HợpĐồngThiếtLậpPhí {
  tênHợpĐồng?: string;
  tổngPhí: SốTiền;
  cácLầnThiếtLậpPhí: ThiếtLậpPhí[];

  constructor(tổngPhí: SốTiền, cácLầnThiếtLậpPhí: ThiếtLậpPhí[], tênHợpĐồng: string | undefined = undefined) {
    this.tênHợpĐồng = tênHợpĐồng;
    this.tổngPhí = tổngPhí;
    this.cácLầnThiếtLậpPhí = cácLầnThiếtLậpPhí;
  }
}

export interface VậtThểPhí {
  ngàyThiếtLập: NgàyThiếtLập;
  chuKỳ: ChuKỳ;
  sốTiềnMỗiKỳ: SốTiền;
  lịchSửĐóngPhí: KỳPhí[];
  kếHoạchĐóngPhí: KỳPhí[];
}

export interface HợpĐồngVậtThểPhí {
  tênHợpĐồng?: string;
  tổngPhí: SốTiền;
  cácVậtThểPhí: VậtThểPhí[];
}
