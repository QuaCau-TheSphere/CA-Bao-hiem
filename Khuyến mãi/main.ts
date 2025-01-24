import { tínhThưởng } from "./Thưởng.ts";
import { viếtSốTiềnDướiDạngDễĐọc } from "./utils.ts";
const dsPhí = [], dsKhuyếnMãiThường = [], dsCắtMáu = [];
for (let phí = 30e6; phí <= 10e9; phí += 10e6) {
  const khuyếnMãiChoKhách = tínhThưởng(phí, 8.5e6);
  const thưởngChoTvv = tínhThưởng(phí, 2.8e6);
  const hoaHồngTvv = phí * 0.02;
  const cắtMáu = thưởngChoTvv + hoaHồngTvv;

  dsPhí.push(phí);
  dsKhuyếnMãiThường.push(khuyếnMãiChoKhách);
  dsCắtMáu.push(cắtMáu);
  console.log(
    viếtSốTiềnDướiDạngDễĐọc(phí),
    viếtSốTiềnDướiDạngDễĐọc(cắtMáu),
  );
}
export const option = {
  xAxis: {
    type: "category",
    data: dsPhí,
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: dsKhuyếnMãiThường,
      type: "line",
    },
    {
      data: dsCắtMáu,
      type: "line",
    },
  ],
};
