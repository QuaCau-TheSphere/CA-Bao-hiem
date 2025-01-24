import { viếtSốTiềnDướiDạngDễĐọc } from "../utils.ts";

const LÃI_SUẤT_3_NĂM = 0.0362;
const LÃI_SUẤT_5_NĂM = 0.0503;

const dsStbh = [
  100e6,
  200e6,
  300e6,
  500e6,
  1e9,
  2e9,
  3e9,
  5e9,
  10e9,
  16e9,
];

function khuyếnMãiChoKhách(phí: number): number {
  if (phí >= 1.25e9) {
    return 8.5e6;
  }
  if (phí >= 250e6) return 8.5e6;
  if (phí >= 200e6) return 4e6;
  if (phí >= 130e6) return 2e6;
  if (phí >= 80e6) return 5e5;
  if (phí >= 30e6) return 1e5;
  return 0;
}

function tínhLãiSuấtSauKhiCắtMáu(stbh: number, lãi: number, sốNăm: number) {
  console.log("stbh:", viếtSốTiềnDướiDạngDễĐọc(stbh));
  const phí = stbh / (1 + lãi);
  console.log("phí:", viếtSốTiềnDướiDạngDễĐọc(phí));
  const hoaHồng = phí * 0.03;
  const kmChoKhách = khuyếnMãiChoKhách(phí);
  console.log("kmChoKhách:", viếtSốTiềnDướiDạngDễĐọc(kmChoKhách));
  const thưởngCốĐịnh = 13.8e6;
  const sốTiềnThựcTrả = phí - hoaHồng - kmChoKhách - thưởngCốĐịnh;
  const lãiThực = stbh - sốTiềnThựcTrả;
  return lãiThực / stbh / sốNăm;
}

for (const stbh of dsStbh) {
  const a3 = tínhLãiSuấtSauKhiCắtMáu(stbh, LÃI_SUẤT_3_NĂM, 3);
  console.log("Lãi:", a3);
  console.log();
  // const a5 = tínhLãiThực(stbh, LÃI_SUẤT_5_NĂM);
  // console.log("a5:", a5);
}
