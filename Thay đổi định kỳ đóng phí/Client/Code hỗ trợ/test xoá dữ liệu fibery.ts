import { ArgsFibery, ContextFibery, FiberyService, TrườngFibery } from "../../../Hàm hỗ trợ/Kiểu cho Fibery.ts";
import { EntityHợpĐồng } from "../Hàm hỗ trợ cho Fibery.ts";

declare const args: ArgsFibery;
declare const context: ContextFibery;

const fibery = context.getService("fibery") as FiberyService;
let cácVậtThểTrườngKỳPhíĐangCó: TrườngFibery<string>[] = [];
for (const entityHợpĐồng of args.currentEntities as EntityHợpĐồng[]) {
  cácVậtThểTrườngKỳPhíĐangCó = (await fibery.getEntityById("Hợp đồng", entityHợpĐồng.Id, ["Kỳ phí"]))["Kỳ phí"] as TrườngFibery<string>[];
}
const idsFromA = cácVậtThểTrườngKỳPhíĐangCó?.map((entity) => entity.Id);
console.log("🚀 ~ idsFromA:", idsFromA);

await fibery.deleteEntityBatch("Kỳ phí", idsFromA);

const query = "{findKyPhis {id, name}}";
const graphql = await fibery.graphql(encodeURIComponent("Định kỳ đóng phí"), query);
const newLocal = graphql["data"]["findKyPhis"];
const idsFromB = newLocal.map((entity: any) => entity.id);
console.log("🚀 ~ idsFromB:", idsFromB);

// const filteredArray = idsFromA.filter((value) => idsFromB.includes(value));
// console.log("🚀 ~ filteredArray:", filteredArray);
