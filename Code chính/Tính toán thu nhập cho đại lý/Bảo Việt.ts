import { SốTiền } from "../../Code hỗ trợ/Số tiền.ts";

export interface TvvBảoViệt {
  ngàyCấpCode: Temporal.PlainDate;
  ip: SốTiền;
}

export interface CấpQuảnLý {
  cácTvv: TvvBảoViệt[];
}

export interface TrưởngNhóm extends CấpQuảnLý {
  ngàyThăngTiến: Temporal.PlainDate;
}

export interface TrưởngBan extends CấpQuảnLý {
  ngàyThăngTiến: Temporal.PlainDate;
}

export function làPa(a: TvvBảoViệt): boolean {
  return true;
  return false;
}

export function làTrưởngBan(a: TvvBảoViệt): boolean {
  return true;
  return false;
}

export function làTrưởngNhóm(a: TvvBảoViệt): boolean {
  return true;
  return false;
}

export function làTiềnTrưởngNhóm(a: TvvBảoViệt): boolean {
  return true;
  return false;
}

export function làHoạtĐộngChuẩn(a: TvvBảoViệt): boolean {
  return true;
  return false;
}

export function làTvvMới(a: TvvBảoViệt): boolean {
  return true;
  return false;
}

export function tuyểnLuyện(a: CấpQuảnLý) {
  const sốLượngTvvMớiHđc: number = 0;
  const tổngFycCủaCácTvvmTạiThángXét: SốTiền = 0;
  switch (sốLượngTvvMớiHđc) {
    case 1:
      return .2 * tổngFycCủaCácTvvmTạiThángXét;
    case 2:
    case 3:
      return .25 * tổngFycCủaCácTvvmTạiThángXét;
    default:
      return .3 * tổngFycCủaCácTvvmTạiThángXét;
  }
}

export function phátTriểnKinhDoanhChoTrưởngNhóm(a: CấpQuảnLý) {
}
