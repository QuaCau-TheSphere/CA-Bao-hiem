import { assertEquals } from "@std/assert/equals";

type ChuKỳPhí = "tháng" | "quý" | "nửa năm" | "năm";
type NgàyĐóngPhí = Temporal.PlainDate;
type DsKỳPhí = NgàyĐóngPhí[];
type CácLầnĐổiChuKỳPhí = Array<[NgàyĐóngPhí, ChuKỳPhí]>;

interface HợpĐồng {
  tổngPhí: number;
  ngàyĐóngPhíĐầuTiên: NgàyĐóngPhí;
  ngàyĐóngPhíCuốiCùng: NgàyĐóngPhí;
  cácLầnĐổiChuKỳPhí: CácLầnĐổiChuKỳPhí;
}

const danhMụcChuKỳPhíSeed = [
  ["tháng", Temporal.Duration.from({ months: 1 })],
  ["quý", Temporal.Duration.from({ months: 3 })],
  ["nửa năm", Temporal.Duration.from({ months: 6 })],
  ["năm", Temporal.Duration.from({ years: 1 })],
] as const;
const danhMụcChuKỳPhí = new Map([...danhMụcChuKỳPhíSeed]);

function kiểmTraHợpĐồng(hợpĐồng: HợpĐồng) {
  const { ngàyĐóngPhíĐầuTiên, ngàyĐóngPhíCuốiCùng } = hợpĐồng;

  assertEquals(ngàyĐóngPhíĐầuTiên.day, ngàyĐóngPhíCuốiCùng.day);
  assertEquals(ngàyĐóngPhíĐầuTiên.month, ngàyĐóngPhíCuốiCùng.month);
}

function tínhCácNgàyĐóngPhíTiếpTheo(dsKỳPhí: DsKỳPhí, chuKỳPhí: ChuKỳPhí) {
  const chuKỳMặcĐịnh = danhMụcChuKỳPhí.get("năm")!;
  const chuKỳ = danhMụcChuKỳPhí.get(chuKỳPhí) || chuKỳMặcĐịnh;
  let dừngVòngLặp = true;
  while (dừngVòngLặp) {
    const NgàyĐóngPhíTrước = dsKỳPhí.at(-1)!;
    const ngàyĐóngPhíTiếpTheo = NgàyĐóngPhíTrước.add(chuKỳ);
    dsKỳPhí.push(ngàyĐóngPhíTiếpTheo);
    dừngVòngLặp = Temporal.PlainDate.compare(ngàyĐóngPhíTiếpTheo, ngàyĐóngPhíCuốiCùng) < 0;
    console.log(ngàyĐóngPhíTiếpTheo, dừngVòngLặp);
  }
  return dsKỳPhí;
}

function đổiChuKỳĐóngPhí(
  thờiĐiểmĐổiChuKỳPhí: Temporal.PlainDate,
  chuKỳPhíMới: ChuKỳPhí,
  dsKỳPhíTrướcĐó: DsKỳPhí | undefined,
) {
  console.log("🚀 ~ dsKỳPhíTrướcĐó:", dsKỳPhíTrướcĐó);
  for (const ii in dsKỳPhíTrướcĐó) {
    console.log("🚀 ~ ii:", ii);
    const i = parseInt(ii);
    const newLocal = Temporal.PlainDate.compare(thờiĐiểmĐổiChuKỳPhí, dsKỳPhíTrướcĐó[i]) < 0;
    if (newLocal) {
      const dsKỳPhíTrướcNgàyĐổi = dsKỳPhíTrướcĐó.slice(undefined, i);
      return tínhCácNgàyĐóngPhíTiếpTheo(dsKỳPhíTrướcNgàyĐổi, chuKỳPhíMới);
    }
  }
  return dsKỳPhíTrướcĐó;
}

const hợpĐồng = {
  tổngPhí: 3e6,
  ngàyĐóngPhíĐầuTiên: new Temporal.PlainDate(2025, 1, 1),
  ngàyĐóngPhíCuốiCùng: new Temporal.PlainDate(2027, 1, 1),
  cácLầnĐổiChuKỳPhí: [
    [new Temporal.PlainDate(2025, 1, 1), "năm"],
    [new Temporal.PlainDate(2025, 9, 30), "quý"],
  ],
} satisfies HợpĐồng;
const { ngàyĐóngPhíĐầuTiên, ngàyĐóngPhíCuốiCùng, cácLầnĐổiChuKỳPhí } = hợpĐồng;

kiểmTraHợpĐồng(hợpĐồng);

/** Danh sách lúc mới ký hợp đồng */
// const dsKỳPhíBanĐầu = tínhCácNgàyĐóngPhíTiếpTheo([ngàyĐóngPhíĐầuTiên], "năm");
// console.log(ngàyĐóngPhíĐầuTiên, dsKỳPhíBanĐầu);
const cácDsKỳPhíĐãTính = [];
for (const [ngàyĐổiChuKỳPhí, chuKỳPhí] of cácLầnĐổiChuKỳPhí) {
  const dsKỳPhíTrướcĐó = cácDsKỳPhíĐãTính.at(-1);
  console.log("🚀 ~ chuKỳPhí:", chuKỳPhí);
  console.log("🚀 ~ dsKỳPhíTrướcĐó:", dsKỳPhíTrướcĐó);
  const dsKỳPhíMới = đổiChuKỳĐóngPhí(ngàyĐổiChuKỳPhí, chuKỳPhí, dsKỳPhíTrướcĐó);
  console.log(ngàyĐổiChuKỳPhí, dsKỳPhíMới);
  cácDsKỳPhíĐãTính.push(dsKỳPhíMới);
}

console.log("🚀 ~ cácDsKỳPhíĐãTính:", cácDsKỳPhíĐãTính);
