import { SốTiền } from "./Kiểu.ts";
import { ChuKỳ } from "./Hàm và kiểu cho thời gian.ts";

export interface Entity {
  "Các lần thiết lập phí": string;
  "Tổng phí": number;
  "Chu kỳ": { Name: string; Id: string };
  "Kỳ đóng phí": string;
}

export interface VậtThểPhíFibery {
  ngàyThiếtLập: string;
  chuKỳ: ChuKỳ;
  sốTiềnMỗiKỳ: number;
  kếHoạchĐóngPhí?: {
    ngàyĐóng: string;
    phíĐóng: SốTiền;
    tổngSốPhíHoànThành: SốTiền;
  }[];
}

export interface HợpĐồngFiberyReq {
  tổngPhí: number;
  cácLầnThiếtLậpPhí: VậtThểPhíFibery[];
}

export interface HợpĐồngFiberyRes {
  tổngPhí: number;
  cácLầnThiếtLậpPhí: VậtThểPhíFibery[];
}

export interface TrườngFibery {
  Name: string;
  Id: string;
}
