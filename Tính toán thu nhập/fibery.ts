// deno-lint-ignore-file no-unused-vars
// deno-lint-ignore-file no-explicit-any

import { ChuKỳ } from "../Hàm hỗ trợ/Hàm và kiểu cho thời gian.ts";
import { HợpĐồngThiếtLậpPhí, HợpĐồngVậtThểPhí, KỳPhí, SốTiền, ThiếtLậpPhí } from "../Hàm hỗ trợ/Kiểu.ts";
import {
  ArgsFibery,
  ContextFibery,
  EntityFibery,
  EntityFiberyĐểTạo,
  FiberyService,
  HttpService,
  Id,
  TrườngFibery,
} from "../Hàm hỗ trợ/Kiểu cho Fibery.ts";
import { lấyKếHoạchĐóngPhíMới } from "./Xử lý vật thể phí.ts";
import { ResBody } from "../Hàm hỗ trợ/Kiểu cho client và server.ts";

declare const context: ContextFibery, args: ArgsFibery;
interface EntityHợpĐồng extends EntityFibery {
  "Các lần thiết lập phí": string;
  "Tổng phí": SốTiền;
  "Số tiền mỗi kỳ": SốTiền;
  "Chu kỳ": TrườngFibery<ChuKỳ>;
  "Kỳ phí": TrườngFibery<string>[] | undefined;
  "Kế hoạch đóng phí": string;
  People: TrườngFibery<string>;
}

interface EntityKỳPhí extends EntityFibery {
  "Ngày đóng": string;
  "Ngày đóng kế tiếp": string;
  "Phí đóng": SốTiền;
  "Tổng số phí hoàn thành": SốTiền;
  People: TrườngFibery<string>;
}

interface EntityKỳPhíĐểTạo extends EntityFiberyĐểTạo {
  "Ngày đóng": string;
  "Ngày đóng kế tiếp": string;
  "Phí đóng": SốTiền;
  "Tổng số phí hoàn thành": SốTiền;
  People: Id;
}

function tạoHợpĐồngThiếtLậpPhí({
  "Các lần thiết lập phí": cácLầnThiếtLậpPhí,
  "Tổng phí": tổngPhí,
  "Chu kỳ": { Name: chuKỳ },
  "Số tiền mỗi kỳ": sốTiềnMỗiKỳ,
}: EntityHợpĐồng): HợpĐồngThiếtLậpPhí {
  const dsCácDòng = cácLầnThiếtLậpPhí.trim().split("\n");
  const cácLầnThiếtLậpPhíTrướcĐây: ThiếtLậpPhí[] = dsCácDòng.map((dòng) => {
    const split1 = dòng.split(": ");
    const split2 = split1[1].split(", ");
    return {
      ngàyThiếtLập: split1[0].trim(),
      chuKỳ: split2[0].trim().toLocaleLowerCase() as ChuKỳ,
      sốTiềnMỗiKỳ: Number(split2[1].trim()),
    };
  });
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

async function lấyKếtQuảTínhToán(hợpĐồng: HợpĐồngThiếtLậpPhí): Promise<ResBody> {
  const res = await http.postAsync("https://nhucau.deno.dev", { body: hợpĐồng });
  return JSON.parse(res);
}

async function cậpNhậtCácLầnThiếtLậpPhí({
  "Các lần thiết lập phí": cácLầnThiếtLậpPhí,
  "Chu kỳ": { Name: chuKỳ },
  "Số tiền mỗi kỳ": sốTiềnMỗiKỳ,
  Type,
  Id,
}: EntityHợpĐồng) {
  const text = cácLầnThiếtLậpPhí.trim() + `\n${hômNay}: ${chuKỳ.toLocaleLowerCase()}, ${sốTiềnMỗiKỳ}`;
  await fibery.updateEntity(Type as string, Id as string, { "Các lần thiết lập phí": text });
}

/** Xoá các kỳ phí sau ngày thiết lập phí mới */
async function xoáCácKỳPhíBịBỏ(cácKỳPhíBịBỏ: KỳPhí[], { Type: databaseHợpĐồng, Id: idHợpĐồng }: EntityHợpĐồng) {
  const cácVậtThểTrườngKỳPhíĐangCó = (await fibery.getEntityById(databaseHợpĐồng, idHợpĐồng, ["Kỳ phí"]))["Kỳ phí"] as TrườngFibery<string>[];
  if (cácVậtThểTrườngKỳPhíĐangCó.length === 0) return;

  const idCácKỳPhíĐangCó = cácVậtThểTrườngKỳPhíĐangCó.map(({ Id }) => Id);
  const idVàNgàyĐóngCácKỳPhíĐangCó = await fibery.getEntitiesByIds("Kỳ phí", idCácKỳPhíĐangCó, ["Ngày đóng"]) as {
    Id: string;
    "Ngày đóng": string;
  }[];

  /** cácNgàyĐóngPhíBịBỏ là các ngày sau ngày thiết lập phí */
  const cácNgàyĐóngPhíBịBỏ = cácKỳPhíBịBỏ.map(({ ngàyĐóng }) => ngàyĐóng);
  const idCácKỳPhíBịBỏ = idVàNgàyĐóngCácKỳPhíĐangCó.flatMap(({ Id, "Ngày đóng": ngàyĐóng }) => cácNgàyĐóngPhíBịBỏ.includes(ngàyĐóng) ? [Id] : []);
  console.log("🚀 ~ idCácKỳPhíBịBỏ:", idCácKỳPhíBịBỏ);
  await fibery.deleteEntityBatch(databaseKỳPhí, idCácKỳPhíBịBỏ);
}

async function ghiKếHoạchĐóngPhíMới(
  hợpĐồngVậtThểPhí: HợpĐồngVậtThểPhí,
  { Name: tênHợpĐồng, Type: databaseHợpĐồng, Id: idEntityHợpĐồng, People: { Id: idChủHợpĐồng }, "Chu kỳ": { Name: chuKỳ } }: EntityHợpĐồng,
) {
  const kếHoạchĐóngPhí = lấyKếHoạchĐóngPhíMới(hợpĐồngVậtThểPhí);
  const cácEntityKỳPhíĐểTạo: EntityKỳPhíĐểTạo[] = kếHoạchĐóngPhí.map(({ ngàyĐóng, ngàyĐóngKếTiếp, phíĐóng, tổngSốPhíHoànThành }) => {
    return {
      Name: `${tênHợpĐồng}, ${chuKỳ}`,
      "Ngày đóng kế tiếp": ngàyĐóngKếTiếp ? ngàyĐóngKếTiếp.toString() : "2099-12-31",
      "Ngày đóng": String(ngàyĐóng),
      "Phí đóng": phíĐóng,
      "Tổng số phí hoàn thành": tổngSốPhíHoànThành,
      People: idChủHợpĐồng,
    };
  });

  const cácEntityKỳPhíĐượcTạo: EntityFibery[] = await fibery.createEntityBatch(databaseKỳPhí, cácEntityKỳPhíĐểTạo);
  const dsEntityKỳPhíDùngĐểThêm = cácEntityKỳPhíĐượcTạo.map((i) => {
    return { id: idEntityHợpĐồng, itemId: i.Id };
  });
  await fibery.addCollectionItemBatch(databaseHợpĐồng, "Kỳ phí", dsEntityKỳPhíDùngĐểThêm);
}

const fibery = context.getService("fibery") as FiberyService;
const http = context.getService("http") as HttpService;

const databaseKỳPhí = "Kỳ phí";
const hômNay = new Date().toISOString().split("T")[0].trim();
for (const entityHợpĐồng of args.currentEntities as EntityHợpĐồng[]) {
  const hợpĐồngThiếtLậpPhí = tạoHợpĐồngThiếtLậpPhí(entityHợpĐồng);
  const { hợpĐồngVậtThểPhí, cácKỳPhíBịBỏ } = await lấyKếtQuảTínhToán(hợpĐồngThiếtLậpPhí);
  console.log("🚀 ~ hợpĐồngVậtThểPhí:", hợpĐồngVậtThểPhí);
  console.log("🚀 ~ cácKỳPhíBịBỏ:", cácKỳPhíBịBỏ);
  await cậpNhậtCácLầnThiếtLậpPhí(entityHợpĐồng);
  await xoáCácKỳPhíBịBỏ(cácKỳPhíBịBỏ, entityHợpĐồng);
  await ghiKếHoạchĐóngPhíMới(hợpĐồngVậtThểPhí, entityHợpĐồng);
}
