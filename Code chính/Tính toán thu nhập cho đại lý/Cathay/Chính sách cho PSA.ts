import { TvvCathay } from "./Tvv.ts";
import { hômNayCathay, làThángCathayCuốiQuý, TemporalCathay, ThángCathay } from "../../../Code hỗ trợ/Xử lý lịch Cathay.ts";
import { SốTiền } from "../../../Code hỗ trợ/Số tiền.ts";

/**
 * Dùng lịch Cathay, chứ không dùng lịch Georgian
 */
export interface Thưởng {
  sốTiền: SốTiền;
  ngàyXétPhát: TemporalCathay;
  ngàyThựcPhát: TemporalCathay;
}

function sốTiềnThưởngThànhTích(pfyc: SốTiền): SốTiền {
  if (sốThángLàmViệc > 13) return 0;
  if (pfyc < 2e6) return 0;
  if (pfyc < 3e6) return 1e6;
  if (pfyc < 4e6) return 1.5e6;
  if (pfyc < 6) return 2e6;
  if (pfyc < 8) return 4e6;
  if (pfyc < 10) return 6.5e6;
  if (pfyc < 12) return 9e6;
  if (pfyc < 15) return 11.5e6;
  if (pfyc < 18) return 15e6;
  if (pfyc < 19) return 18e6;
  return Math.floor(pfyc / 1e6) * 1e6;
}

function sốTiềnThưởngChênhLệchQuý(): SốTiền {
  const sốHợpĐồngTrongTháng = 0; //todo
  if (làThángCathayCuốiQuý() && sốHợpĐồngTrongTháng === 0) return 0;

  return 0;
}

class ThưởngThànhTích implements Thưởng {
  sốTiền: SốTiền;
  ngàyXétPhát: TemporalCathay;
  ngàyThựcPhát: TemporalCathay;

  constructor(pfyc: SốTiền, ngàyXétPhát: TemporalCathay = hômNayCathay) {
    this.sốTiền = sốTiềnThưởngThànhTích(pfyc);
    this.ngàyXétPhát = ngàyXétPhát;

    const { tháng, tuầnTrongTháng } = ngàyXétPhát;
    if (tuầnTrongTháng === 1) {
      this.ngàyThựcPhát = new TemporalCathay(28, tháng);
    } else {
      this.ngàyThựcPhát = new TemporalCathay(28, tháng + 1);
    }
  }
}

const thưởngThànhTích: Thưởng = {
  ngàyThựcPhát: {
    ngày: 28,
  },
  sốTiền: sốTiềnThưởngThànhTích(tvv.dsHoạtĐộng[0].pfyc),
};
