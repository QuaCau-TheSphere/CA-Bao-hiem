// deno-lint-ignore-file no-unused-vars
// deno-lint-ignore-file no-explicit-any

import { ChuKỳ } from "../Hàm hỗ trợ/Hàm và kiểu cho thời gian.ts";
import { HợpĐồngThiếtLậpPhí, HợpĐồngVậtThểPhí, SốTiền, ThiếtLậpPhí } from "../Hàm hỗ trợ/Kiểu.ts";
import { ArgsFibery, ContextFibery, EntityFibery, FiberyService, HttpService, TrườngFibery } from "../Hàm hỗ trợ/Kiểu cho Fibery.ts";
import { lấyKếHoạchĐóngPhíMới } from "./Xử lý vật thể phí.ts";

declare const context: ContextFibery, args: ArgsFibery;
const fibery = context.getService("fibery") as FiberyService;
const http = context.getService("http") as HttpService;

interface EntityHợpĐồng extends EntityFibery {
  "Các lần thiết lập phí": string;
  "Tổng phí": SốTiền;
  "Số tiền mỗi kỳ": SốTiền;
  "Chu kỳ": TrườngFibery;
  "Kỳ đóng phí": string;
  "Kế hoạch đóng phí": string;
}

interface EntityKỳPhí extends EntityFibery {
  "Ngày đóng": string;
  "Ngày đóng kế tiếp": string;
  "Phí đóng": SốTiền;
  "Tổng số phí hoàn thành": SốTiền;
}

function tạoHợpĐồngThiếtLậpPhí({
  "Các lần thiết lập phí": cácLầnThiếtLậpPhí,
  "Tổng phí": tổngPhí,
  "Chu kỳ": { Name: chuKỳ },
  "Số tiền mỗi kỳ": sốTiềnMỗiKỳ,
}: EntityHợpĐồng): HợpĐồngThiếtLậpPhí {
  const dsCácDòng = cácLầnThiếtLậpPhí.trim().split("\n");
  const cácLầnThiếtLậpPhíTrướcĐây: ThiếtLậpPhí[] = dsCácDòng.map((dòng) => {
    const split1 = dòng.split(":");
    const split2 = split1[1].split(",");
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

async function lấyHợpĐồngVậtThểPhí(hợpĐồng: HợpĐồngThiếtLậpPhí): Promise<HợpĐồngVậtThểPhí> {
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
  const hômNay = new Date().toISOString().split("T")[0].trim();
  const text = cácLầnThiếtLậpPhí.trim() + `\n${hômNay}: ${chuKỳ.toLocaleLowerCase()}, ${sốTiềnMỗiKỳ}`;
  await fibery.updateEntity(Type as string, Id as string, { "Các lần thiết lập phí": text });
}

async function ghiKếHoạchĐóngPhíMới(hợpĐồngVậtThểPhí: HợpĐồngVậtThểPhí) {
  const kếHoạchĐóngPhí = lấyKếHoạchĐóngPhíMới(hợpĐồngVậtThểPhí);
  const entities: EntityKỳPhí[] = kếHoạchĐóngPhí.map(({ ngàyĐóng, ngàyĐóngKếTiếp, phíĐóng, tổngSốPhíHoànThành }) => {
    return {
      Name: "",
      "Ngày đóng kế tiếp": ngàyĐóngKếTiếp ? ngàyĐóngKếTiếp.toString() : "2099-12-31",
      "Ngày đóng": String(ngàyĐóng),
      "Phí đóng": phíĐóng,
      "Tổng số phí hoàn thành": tổngSốPhíHoànThành,
    };
  });
  const type = "Kỳ phí";
  await fibery.createEntityBatch(type, entities);
  await fibery.updateEntity(Type, Id, { "Các lần thiết lập phí": text });
}
for (const entity of args.currentEntities as EntityHợpĐồng[]) {
  const hợpĐồngThiếtLậpPhí = tạoHợpĐồngThiếtLậpPhí(entity);
  const hợpĐồngVậtThểPhí = await lấyHợpĐồngVậtThểPhí(hợpĐồngThiếtLậpPhí);
  await cậpNhậtCácLầnThiếtLậpPhí(entity);
  await ghiKếHoạchĐóngPhíMới(hợpĐồngVậtThểPhí);
}

// // to get collection fields query the API and provide the list of fields
// const entityWithExtraFields = await fibery.getEntityById(entity.type, entity.id, ["Chu kỳ", "Kỳ đóng phí"]);
// console.log("🚀 ~ entityWithExtraFields:", entityWithExtraFields);

// // to update an entity provide an object with the new values
// await fibery.updateEntity(entity.type, entity.id, {
//   // 'Field Name': newValue
// });
