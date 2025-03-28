// deno-lint-ignore-file no-unused-vars
// deno-lint-ignore-file no-explicit-any

import { ChuKỳ } from "../../Hàm hỗ trợ/Hàm và kiểu cho thời gian.ts";
import { HợpĐồngThiếtLậpPhí, HợpĐồngVậtThểPhí, KỳPhí, SốTiền, ThiếtLậpPhí } from "../../Hàm hỗ trợ/Kiểu cho hợp đồng và phí.ts";
import { ResBody } from "../../Hàm hỗ trợ/Kiểu cho client và server.ts";
import {
  ArgsFibery,
  ContextFibery,
  EntityFibery,
  EntityFiberyToCreate,
  FiberyService,
  HttpService,
  Id,
  TrườngFibery,
} from "../../Hàm hỗ trợ/Kiểu cho Fibery.ts";

const databaseKỳPhí = "Cathay Life/Kỳ phí";

export const hômNay = new Date().toISOString().split("T")[0].trim();
export declare const context: ContextFibery;

export const fibery = context.getService("fibery") as FiberyService;
export const http = context.getService("http") as HttpService;

export interface EntityHợpĐồng extends EntityFibery {
  "Các lần thiết lập phí": string | undefined;
  "Tổng phí": SốTiền;
  "Số tiền mỗi kỳ": SốTiền;
  "Chu kỳ": TrườngFibery<Capitalize<ChuKỳ>>;
  "Kỳ phí": TrườngFibery<string>[] | undefined;
  People: TrườngFibery<string>;
}
interface EntityKỳPhí extends EntityFibery {
  "Ngày đóng": string;
  "Ngày đóng kế tiếp": string;
  "Phí đóng": SốTiền;
  "Tổng số phí hoàn thành": SốTiền;
  People: TrườngFibery<string>;
}
interface EntityKỳPhíĐểTạo extends EntityFiberyToCreate {
  "Ngày đóng": string;
  "Ngày đóng kế tiếp": string;
  "Phí đóng": SốTiền;
  "Tổng số phí hoàn thành": SốTiền;
}
function lấyKếHoạchĐóngPhíMới({ cácVậtThểPhí }: HợpĐồngVậtThểPhí) {
  const vậtThểPhíCuốiCùng = cácVậtThểPhí.slice(-1)[0];
  return vậtThểPhíCuốiCùng.kếHoạchĐóngPhí;
}
export function tạoHợpĐồngThiếtLậpPhí({
  "Các lần thiết lập phí": cácLầnThiếtLậpPhí,
  "Tổng phí": tổngPhí,
  "Chu kỳ": { Name: chuKỳ },
  "Số tiền mỗi kỳ": sốTiềnMỗiKỳ,
}: EntityHợpĐồng): HợpĐồngThiếtLậpPhí {
  const dsCácDòng = cácLầnThiếtLậpPhí ? cácLầnThiếtLậpPhí.trim().split("\n") : undefined;
  const cácLầnThiếtLậpPhíTrướcĐây: ThiếtLậpPhí[] = dsCácDòng?.map((dòng) => {
    const split1 = dòng.split(": ");
    const split2 = split1[1].split(", ");
    return {
      ngàyThiếtLập: split1[0].trim(),
      chuKỳ: split2[0].trim().toLocaleLowerCase() as ChuKỳ,
      sốTiềnMỗiKỳ: Number(split2[1].trim()),
    };
  }) || [];
  const lầnThiếtLậpPhíLầnNày: ThiếtLậpPhí = {
    chuKỳ: chuKỳ.toLocaleLowerCase() as ChuKỳ,
    ngàyThiếtLập: new Date().toISOString().split("T")[0],
    sốTiềnMỗiKỳ: sốTiềnMỗiKỳ,
  };
  return {
    tổngPhí: tổngPhí,
    cácLầnThiếtLậpPhí: cácLầnThiếtLậpPhíTrướcĐây.concat(lầnThiếtLậpPhíLầnNày),
  };
}
export async function lấyKếtQuảTínhToán(hợpĐồng: HợpĐồngThiếtLậpPhí): Promise<ResBody> {
  const res = await http.postAsync("https://nhucau.deno.dev", { body: hợpĐồng });
  return JSON.parse(res);
}
export async function cậpNhậtCácLầnThiếtLậpPhí({
  "Các lần thiết lập phí": cácLầnThiếtLậpPhí,
  "Chu kỳ": { Name: chuKỳ },
  "Số tiền mỗi kỳ": sốTiềnMỗiKỳ,
  Type,
  Id,
}: EntityHợpĐồng) {
  if (!chuKỳ) return;

  let textLog: string;
  if (!cácLầnThiếtLậpPhí) {
    textLog = `${hômNay}: ${chuKỳ.toLocaleLowerCase()}, ${sốTiềnMỗiKỳ}`;
  } else {
    textLog = cácLầnThiếtLậpPhí.trim() + `\n${hômNay}: ${chuKỳ.toLocaleLowerCase()}, ${sốTiềnMỗiKỳ}`;
  }
  await fibery.updateEntity(Type as string, Id as string, { "Các lần thiết lập phí": textLog });
}
/** Xoá các kỳ phí sau ngày thiết lập phí mới */

export async function xoáCácKỳPhíBịBỏ(cácKỳPhíBịBỏ: KỳPhí[], { Type: databaseHợpĐồng, Id: idHợpĐồng }: EntityHợpĐồng) {
  const cácVậtThểTrườngKỳPhíĐangCó = (await fibery.getEntityById(databaseHợpĐồng, idHợpĐồng, ["Kỳ phí"]))["Kỳ phí"] as TrườngFibery<string>[];
  if (cácVậtThểTrườngKỳPhíĐangCó.length === 0) return;

  const idCácKỳPhíĐangCó = cácVậtThểTrườngKỳPhíĐangCó.map(({ Id }) => Id);
  const idVàNgàyĐóngCácKỳPhíĐangCó = await fibery.getEntitiesByIds("Kỳ phí", idCácKỳPhíĐangCó, ["Ngày đóng"]) as {
    Id: string;
    "Ngày đóng": string;
  }[];
  console.log("🚀 ~ idVàNgàyĐóngCácKỳPhíĐangCó:", idVàNgàyĐóngCácKỳPhíĐangCó);

  /** cácNgàyĐóngPhíBịBỏ là các ngày sau ngày thiết lập phí */
  const cácNgàyĐóngPhíBịBỏ = cácKỳPhíBịBỏ.map(({ ngàyĐóng }) => ngàyĐóng);
  console.log("🚀 ~ cácNgàyĐóngPhíBịBỏ:", cácNgàyĐóngPhíBịBỏ);
  const idCácKỳPhíBịBỏ = idVàNgàyĐóngCácKỳPhíĐangCó.flatMap(({ Id, "Ngày đóng": ngàyĐóng }) => cácNgàyĐóngPhíBịBỏ.includes(ngàyĐóng) ? [Id] : []);
  console.log("🚀 ~ idCácKỳPhíBịBỏ:", idCácKỳPhíBịBỏ);
  await fibery.deleteEntityBatch(databaseKỳPhí, idCácKỳPhíBịBỏ);
}

export async function ghiKếHoạchĐóngPhíMới(
  hợpĐồngVậtThểPhí: HợpĐồngVậtThểPhí,
  entityHợpĐồng: EntityHợpĐồng,
) {
  const kếHoạchĐóngPhí = lấyKếHoạchĐóngPhíMới(hợpĐồngVậtThểPhí);
  const { Name: tênHợpĐồng, Type: databaseHợpĐồng, Id: idEntityHợpĐồng, "Chu kỳ": { Name: chuKỳ } } = entityHợpĐồng;
  const cácEntityKỳPhíĐểTạo: EntityKỳPhíĐểTạo[] = kếHoạchĐóngPhí.map(({ ngàyĐóng, ngàyĐóngKếTiếp, phíĐóng, tổngSốPhíHoànThành }) => {
    return {
      "Ngày đóng kế tiếp": ngàyĐóngKếTiếp ? ngàyĐóngKếTiếp.toString() : "2099-12-31",
      "Ngày đóng": String(ngàyĐóng),
      "Phí đóng": phíĐóng,
      "Tổng số phí hoàn thành": tổngSốPhíHoànThành,
    };
  });

  const cácEntityKỳPhíĐượcTạo: EntityFibery[] = await fibery.createEntityBatch(databaseKỳPhí, cácEntityKỳPhíĐểTạo);
  const dsEntityKỳPhíDùngĐểThêm = cácEntityKỳPhíĐượcTạo.map((i) => {
    return { id: idEntityHợpĐồng, itemId: i.Id };
  });
  await fibery.addCollectionItemBatch(databaseHợpĐồng, "Kỳ phí", dsEntityKỳPhíDùngĐểThêm);

  const cácEntityPeopleTrongEntityHợpĐồng: EntityFibery[] = (await fibery.getEntityById(databaseHợpĐồng, idEntityHợpĐồng, [
    "People (NDBH)",
  ]))["People (NDBH)"];
  for (const { Id: idEntityKỳPhí } of cácEntityKỳPhíĐượcTạo) {
    const dsEntityPeopleDùngĐểThêm = cácEntityPeopleTrongEntityHợpĐồng.map((i) => {
      return { id: idEntityKỳPhí, itemId: i.Id };
    });
    await fibery.addCollectionItemBatch(databaseKỳPhí, "People", dsEntityPeopleDùngĐểThêm);
  }
}
