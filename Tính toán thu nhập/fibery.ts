// // deno-lint-ignore-file no-unused-vars
import { tínhKếHoạchĐóngPhí } from "./Định kỳ đóng phí.ts";
import { ChuKỳ, HợpĐồng, VậtThểPhí } from "./Kiểu.ts";
import { Temporal } from "npm:temporal-polyfill";

declare const context: any, args: any;
const fibery = context.getService("fibery");

interface Entity {
  "Các lần thiết lập phí": string;
  "Tổng phí": number;
  "Chu kỳ": { Name: string; Id: string };
  "Kỳ đóng phí": string;
}

function tạoHợpĐồngTừEntity(entity: Entity): HợpĐồng {
  const { "Các lần thiết lập phí": cácLầnThiếtLậpPhíEntity, "Tổng phí": tổngPhí } = entity;
  const cácLầnThiếtLậpPhí: VậtThểPhí[] = cácLầnThiếtLậpPhíEntity.split("\n").map((dòng) => {
    const split1 = dòng.split(":");
    const split2 = split1[1].split(",");
    return {
      ngàyThiếtLập: Temporal.PlainDate.from(split1[0]),
      chuKỳ: split2[0].toLocaleLowerCase() as ChuKỳ,
      sốTiềnMỗiKỳ: parseInt(split2[1]),
    };
  });
  return {
    tổngPhí: tổngPhí,
    cácLầnThiếtLậpPhí: cácLầnThiếtLậpPhí,
  };
}
for (const entity of args.currentEntities as Entity[]) {
  const {
    "Chu kỳ": { Name: chuKỳ, Id: idChuKỳ },
    "Kỳ đóng phí": kỳĐóngPhíCóSẵnEntity,
  } = entity;
  const hợpĐồng = tạoHợpĐồngTừEntity(entity);
  console.log("1:", hợpĐồng);
  tínhKếHoạchĐóngPhí(hợpĐồng);
  console.log("2:", hợpĐồng);
}

// // to get collection fields query the API and provide the list of fields
// const entityWithExtraFields = await fibery.getEntityById(entity.type, entity.id, ["Chu kỳ", "Kỳ đóng phí"]);
// console.log("🚀 ~ entityWithExtraFields:", entityWithExtraFields);

// // to update an entity provide an object with the new values
// await fibery.updateEntity(entity.type, entity.id, {
//   // 'Field Name': newValue
// });
// { Name: kỳĐóngPhí, Id: idKỳĐóngPhí }
