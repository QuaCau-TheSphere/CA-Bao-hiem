// Tạo lúc 14:25:18 ngày 10/2/2025

// Tính toán thu nhập/Client/Hàm hỗ trợ cho Fibery.ts
var databaseKỳPhí = "Định kỳ đóng phí/Kỳ phí";
var hômNay = (/* @__PURE__ */ new Date()).toISOString().split("T")[0].trim();
var fibery = context.getService("fibery");
var http = context.getService("http");
function lấyKếHoạchĐóngPhíMới({ cácVậtThểPhí }) {
  const vậtThểPhíCuốiCùng = cácVậtThểPhí.slice(-1)[0];
  return vậtThểPhíCuốiCùng.kếHoạchĐóngPhí;
}
function tạoHợpĐồngThiếtLậpPhí({
  "Các lần thiết lập phí": cácLầnThiếtLậpPhí,
  "Tổng phí": tổngPhí,
  "Chu kỳ": { Name: chuKỳ },
  "Số tiền mỗi kỳ": sốTiềnMỗiKỳ
}) {
  const dsCácDòng = cácLầnThiếtLậpPhí ? cácLầnThiếtLậpPhí.trim().split("\n") : void 0;
  const cácLầnThiếtLậpPhíTrướcĐây = (dsCácDòng == null ? void 0 : dsCácDòng.map((dòng) => {
    const split1 = dòng.split(": ");
    const split2 = split1[1].split(", ");
    return {
      ngàyThiếtLập: split1[0].trim(),
      chuKỳ: split2[0].trim().toLocaleLowerCase(),
      sốTiềnMỗiKỳ: Number(split2[1].trim())
    };
  })) || [];
  const lầnThiếtLậpPhíLầnNày = {
    chuKỳ: chuKỳ.toLocaleLowerCase(),
    ngàyThiếtLập: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    sốTiềnMỗiKỳ
  };
  return {
    tổngPhí,
    cácLầnThiếtLậpPhí: cácLầnThiếtLậpPhíTrướcĐây.concat(lầnThiếtLậpPhíLầnNày)
  };
}
async function lấyKếtQuảTínhToán(hợpĐồng) {
  const res = await http.postAsync("https://nhucau.deno.dev", { body: hợpĐồng });
  return JSON.parse(res);
}
async function cậpNhậtCácLầnThiếtLậpPhí({
  "Các lần thiết lập phí": cácLầnThiếtLậpPhí,
  "Chu kỳ": { Name: chuKỳ },
  "Số tiền mỗi kỳ": sốTiềnMỗiKỳ,
  Type,
  Id
}) {
  if (!chuKỳ)
    return;
  const text = (cácLầnThiếtLậpPhí == null ? void 0 : cácLầnThiếtLậpPhí.trim()) + `
${hômNay}: ${chuKỳ.toLocaleLowerCase()}, ${sốTiềnMỗiKỳ}`;
  await fibery.updateEntity(Type, Id, { "Các lần thiết lập phí": text });
}
async function xoáCácKỳPhíBịBỏ(cácKỳPhíBịBỏ, { Type: databaseHợpĐồng, Id: idHợpĐồng }) {
  const cácVậtThểTrườngKỳPhíĐangCó = (await fibery.getEntityById(databaseHợpĐồng, idHợpĐồng, ["Kỳ phí"]))["Kỳ phí"];
  if (cácVậtThểTrườngKỳPhíĐangCó.length === 0)
    return;
  const idCácKỳPhíĐangCó = cácVậtThểTrườngKỳPhíĐangCó.map(({ Id }) => Id);
  const idVàNgàyĐóngCácKỳPhíĐangCó = await fibery.getEntitiesByIds("Kỳ phí", idCácKỳPhíĐangCó, ["Ngày đóng"]);
  console.log("🚀 ~ idVàNgàyĐóngCácKỳPhíĐangCó:", idVàNgàyĐóngCácKỳPhíĐangCó);
  const cácNgàyĐóngPhíBịBỏ = cácKỳPhíBịBỏ.map(({ ngàyĐóng }) => ngàyĐóng);
  console.log("🚀 ~ cácNgàyĐóngPhíBịBỏ:", cácNgàyĐóngPhíBịBỏ);
  const idCácKỳPhíBịBỏ = idVàNgàyĐóngCácKỳPhíĐangCó.flatMap(({ Id, "Ngày đóng": ngàyĐóng }) => cácNgàyĐóngPhíBịBỏ.includes(ngàyĐóng) ? [Id] : []);
  console.log("🚀 ~ idCácKỳPhíBịBỏ:", idCácKỳPhíBịBỏ);
  await fibery.deleteEntityBatch(databaseKỳPhí, idCácKỳPhíBịBỏ);
}
async function ghiKếHoạchĐóngPhíMới(hợpĐồngVậtThểPhí, entityHợpĐồng) {
  const kếHoạchĐóngPhí = lấyKếHoạchĐóngPhíMới(hợpĐồngVậtThểPhí);
  const { Name: tênHợpĐồng, Type: databaseHợpĐồng, Id: idEntityHợpĐồng, "Chu kỳ": { Name: chuKỳ } } = entityHợpĐồng;
  const cácEntityKỳPhíĐểTạo = kếHoạchĐóngPhí.map(({ ngàyĐóng, ngàyĐóngKếTiếp, phíĐóng, tổngSốPhíHoànThành }) => {
    return {
      Name: `${tênHợpĐồng}, ${chuKỳ}`,
      "Ngày đóng kế tiếp": ngàyĐóngKếTiếp ? ngàyĐóngKếTiếp.toString() : "2099-12-31",
      "Ngày đóng": String(ngàyĐóng),
      "Phí đóng": phíĐóng,
      "Tổng số phí hoàn thành": tổngSốPhíHoànThành
    };
  });
  const cácEntityKỳPhíĐượcTạo = await fibery.createEntityBatch(databaseKỳPhí, cácEntityKỳPhíĐểTạo);
  const dsEntityKỳPhíDùngĐểThêm = cácEntityKỳPhíĐượcTạo.map((i) => {
    return { id: idEntityHợpĐồng, itemId: i.Id };
  });
  await fibery.addCollectionItemBatch(databaseHợpĐồng, "Kỳ phí", dsEntityKỳPhíDùngĐểThêm);
  const cácEntityPeopleTrongEntityHợpĐồng = (await fibery.getEntityById(databaseHợpĐồng, idEntityHợpĐồng, [
    "People (NDBT)"
  ]))["People (NDBT)"];
  for (const { Id: idEntityKỳPhí } of cácEntityKỳPhíĐượcTạo) {
    const dsEntityPeopleDùngĐểThêm = cácEntityPeopleTrongEntityHợpĐồng.map((i) => {
      return { id: idEntityKỳPhí, itemId: i.Id };
    });
    await fibery.addCollectionItemBatch(databaseKỳPhí, "People", dsEntityPeopleDùngĐểThêm);
  }
}

// Tính toán thu nhập/Client/fibery.ts
async function main(currentEntities) {
  for (const entityHợpĐồng of currentEntities) {
    const khôngCóChuKỳ = entityHợpĐồng["Chu kỳ"].Name === null;
    if (khôngCóChuKỳ)
      return;
    const hợpĐồngThiếtLậpPhí = tạoHợpĐồngThiếtLậpPhí(entityHợpĐồng);
    const { hợpĐồngVậtThểPhí, cácKỳPhíBịBỏ } = await lấyKếtQuảTínhToán(hợpĐồngThiếtLậpPhí);
    await cậpNhậtCácLầnThiếtLậpPhí(entityHợpĐồng);
    await xoáCácKỳPhíBịBỏ(cácKỳPhíBịBỏ, entityHợpĐồng);
    await ghiKếHoạchĐóngPhíMới(hợpĐồngVậtThểPhí, entityHợpĐồng);
  }
}
await main(args.currentEntities);
// Tạo lúc 14:25:18 ngày 10/2/2025
