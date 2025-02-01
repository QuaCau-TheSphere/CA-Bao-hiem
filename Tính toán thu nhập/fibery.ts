// deno-lint-ignore-file no-unused-vars
import { Entity, HợpĐồngFiberyReq, HợpĐồngFiberyRes } from "../Hàm hỗ trợ/Kiểu cho client và server.ts";
import { ChuKỳ } from "../Hàm hỗ trợ/Hàm và kiểu cho thời gian.ts";

declare const context: any, args: any;
const fibery = context.getService("fibery");
const http = context.getService("http");

/**
 * Đúng ra là nên trả về kiểu `HợpĐồng` luôn, nhưng do `ngàyThiếtLập` ở đó là Temporal, mà khi bundle Temporal với polyfill thì nó quá nặng Fibery không chịu, nên mới tạo một cái tương tự nhưng thời gian chỉ ở dạng string
 */
function tạoHợpĐồngTừEntity(entity: Entity): HợpĐồngFiberyReq {
  const { "Các lần thiết lập phí": cácLầnThiếtLậpPhíEntity, "Tổng phí": tổngPhí, "Chu kỳ": { Name: chuKỳ, Id: idChuKỳ } } = entity;
  const dsCácDòng = cácLầnThiếtLậpPhíEntity.trim().split("\n");
  const cácLầnThiếtLậpPhíTrướcĐây = dsCácDòng.map((dòng) => {
    const split1 = dòng.split(":");
    const split2 = split1[1].split(",");
    return {
      ngàyThiếtLập: split1[0],
      chuKỳ: split2[0].toLocaleLowerCase() as ChuKỳ,
      sốTiềnMỗiKỳ: parseInt(split2[1]),
    };
  });
  return {
    tổngPhí: tổngPhí,
    cácLầnThiếtLậpPhí: cácLầnThiếtLậpPhíTrướcĐây,
  };
}

async function tínhKếHoạchĐóngPhí(hợpĐồng: HợpĐồngFiberyReq): Promise<HợpĐồngFiberyRes> {
  const res = await http.postAsync("https://nhucau.deno.dev", { body: hợpĐồng });
  return JSON.parse(res);
}

for (const entity of args.currentEntities as Entity[]) {
  let hợpĐồng = tạoHợpĐồngTừEntity(entity);
  console.log("🚀 ~ hợpĐồng:", hợpĐồng);
  hợpĐồng = await tínhKếHoạchĐóngPhí(hợpĐồng);
  console.log("🚀 ~ hợpĐồng:", hợpĐồng);
}

// // to get collection fields query the API and provide the list of fields
// const entityWithExtraFields = await fibery.getEntityById(entity.type, entity.id, ["Chu kỳ", "Kỳ đóng phí"]);
// console.log("🚀 ~ entityWithExtraFields:", entityWithExtraFields);

// // to update an entity provide an object with the new values
// await fibery.updateEntity(entity.type, entity.id, {
//   // 'Field Name': newValue
// });
// { Name: kỳĐóngPhí, Id: idKỳĐóngPhí }
