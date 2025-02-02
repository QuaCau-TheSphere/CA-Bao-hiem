// deno-lint-ignore-file no-unused-vars
import { EntityFibery } from "../Hàm hỗ trợ/Kiểu cho client và server.ts";
import { ChuKỳ } from "../Hàm hỗ trợ/Hàm và kiểu cho thời gian.ts";
import { HợpĐồngThiếtLậpPhí, HợpĐồngVậtThểPhí, ThiếtLậpPhí } from "../Hàm hỗ trợ/Kiểu.ts";
import { lấyKếHoạchĐóngPhíMới } from "./Xử lý vật thể phí.ts";

declare const context: any, args: any;
const fibery = context.getService("fibery");
const http = context.getService("http");

function tạoHợpĐồngTừEntity(entity: EntityFibery): HợpĐồngThiếtLậpPhí {
  const {
    "Các lần thiết lập phí": cácLầnThiếtLậpPhíEntity,
    "Tổng phí": tổngPhí,
    "Chu kỳ": { Name: chuKỳ, Id: idChuKỳ },
    "Số tiền mỗi kỳ": sốTiềnMỗiKỳ,
  } = entity;
  const dsCácDòng = cácLầnThiếtLậpPhíEntity.trim().split("\n");
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

async function tínhKếHoạchĐóngPhí(hợpĐồng: HợpĐồngThiếtLậpPhí): Promise<HợpĐồngVậtThểPhí> {
  const res = await http.postAsync("https://nhucau.deno.dev", { body: hợpĐồng });
  return JSON.parse(res);
}

async function main() {
  for (const entity of args.currentEntities as EntityFibery[]) {
    const hợpĐồngThiếtLậpPhí = tạoHợpĐồngTừEntity(entity);
    const hợpĐồngVậtThểPhí = await tínhKếHoạchĐóngPhí(hợpĐồngThiếtLậpPhí);
    const kếHoạchĐóngPhí = lấyKếHoạchĐóngPhíMới(hợpĐồngVậtThểPhí);
    console.log("🚀 ~ kếHoạchĐóngPhí:", kếHoạchĐóngPhí);
  }
}

await main();
// // to get collection fields query the API and provide the list of fields
// const entityWithExtraFields = await fibery.getEntityById(entity.type, entity.id, ["Chu kỳ", "Kỳ đóng phí"]);
// console.log("🚀 ~ entityWithExtraFields:", entityWithExtraFields);

// // to update an entity provide an object with the new values
// await fibery.updateEntity(entity.type, entity.id, {
//   // 'Field Name': newValue
// });
// { Name: kỳĐóngPhí, Id: idKỳĐóngPhí }
