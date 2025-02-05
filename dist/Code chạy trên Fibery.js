// Tính toán thu nhập/Xử lý vật thể phí.ts
function lấyKếHoạchĐóngPhíMới({ cácVậtThểPhí }) {
  const vậtThểPhíCuốiCùng = cácVậtThểPhí.slice(-1)[0];
  return vậtThểPhíCuốiCùng.kếHoạchĐóngPhí;
}

// Tính toán thu nhập/fibery.ts
function tạoHợpĐồngThiếtLậpPhí({
  "Các lần thiết lập phí": cácLầnThiếtLậpPhí,
  "Tổng phí": tổngPhí,
  "Chu kỳ": { Name: chuKỳ },
  "Số tiền mỗi kỳ": sốTiềnMỗiKỳ
}) {
  const dsCácDòng = cácLầnThiếtLậpPhí.trim().split("\n");
  const cácLầnThiếtLậpPhíTrướcĐây = dsCácDòng.map((dòng) => {
    const split1 = dòng.split(": ");
    const split2 = split1[1].split(", ");
    return {
      ngàyThiếtLập: split1[0].trim(),
      chuKỳ: split2[0].trim().toLocaleLowerCase(),
      sốTiềnMỗiKỳ: Number(split2[1].trim())
    };
  });
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
  const text = cácLầnThiếtLậpPhí.trim() + `
${hômNay}: ${chuKỳ.toLocaleLowerCase()}, ${sốTiềnMỗiKỳ}`;
  await fibery.updateEntity(Type, Id, { "Các lần thiết lập phí": text });
}
async function xoáCácKỳPhíBịBỏ(cácKỳPhíBịBỏ, { Type: databaseHợpĐồng, Id: idHợpĐồng }) {
  const cácVậtThểTrườngKỳPhíĐangCó = (await fibery.getEntityById(databaseHợpĐồng, idHợpĐồng, ["Kỳ phí"]))["Kỳ phí"];
  if (cácVậtThểTrườngKỳPhíĐangCó.length === 0)
    return;
  const idCácKỳPhíĐangCó = cácVậtThểTrườngKỳPhíĐangCó.map(({ Id }) => Id);
  const idVàNgàyĐóngCácKỳPhíĐangCó = await fibery.getEntitiesByIds("Kỳ phí", idCácKỳPhíĐangCó, ["Ngày đóng"]);
  const cácNgàyĐóngPhíBịBỏ = cácKỳPhíBịBỏ.map(({ ngàyĐóng }) => ngàyĐóng);
  const idCácKỳPhíBịBỏ = idVàNgàyĐóngCácKỳPhíĐangCó.flatMap(({ Id, "Ngày đóng": ngàyĐóng }) => cácNgàyĐóngPhíBịBỏ.includes(ngàyĐóng) ? [Id] : []);
  console.log("🚀 ~ idCácKỳPhíBịBỏ:", idCácKỳPhíBịBỏ);
  await fibery.deleteEntityBatch(databaseKỳPhí, idCácKỳPhíBịBỏ);
}
async function ghiKếHoạchĐóngPhíMới(hợpĐồngVậtThểPhí, { Name: tênHợpĐồng, Type: databaseHợpĐồng, Id: idEntityHợpĐồng, People: { Id: idChủHợpĐồng }, "Chu kỳ": { Name: chuKỳ } }) {
  const kếHoạchĐóngPhí = lấyKếHoạchĐóngPhíMới(hợpĐồngVậtThểPhí);
  const cácEntityKỳPhíĐểTạo = kếHoạchĐóngPhí.map(({ ngàyĐóng, ngàyĐóngKếTiếp, phíĐóng, tổngSốPhíHoànThành }) => {
    return {
      Name: `${tênHợpĐồng}, ${chuKỳ}`,
      "Ngày đóng kế tiếp": ngàyĐóngKếTiếp ? ngàyĐóngKếTiếp.toString() : "2099-12-31",
      "Ngày đóng": String(ngàyĐóng),
      "Phí đóng": phíĐóng,
      "Tổng số phí hoàn thành": tổngSốPhíHoànThành,
      People: idChủHợpĐồng
    };
  });
  const cácEntityKỳPhíĐượcTạo = await fibery.createEntityBatch(databaseKỳPhí, cácEntityKỳPhíĐểTạo);
  const dsEntityKỳPhíDùngĐểThêm = cácEntityKỳPhíĐượcTạo.map((i) => {
    return { id: idEntityHợpĐồng, itemId: i.Id };
  });
  await fibery.addCollectionItemBatch(databaseHợpĐồng, "Kỳ phí", dsEntityKỳPhíDùngĐểThêm);
}
var fibery = context.getService("fibery");
var http = context.getService("http");
var databaseKỳPhí = "Kỳ phí";
var hômNay = (/* @__PURE__ */ new Date()).toISOString().split("T")[0].trim();
for (const entityHợpĐồng of args.currentEntities) {
  const hợpĐồngThiếtLậpPhí = tạoHợpĐồngThiếtLậpPhí(entityHợpĐồng);
  const { hợpĐồngVậtThểPhí, cácKỳPhíBịBỏ } = await lấyKếtQuảTínhToán(hợpĐồngThiếtLậpPhí);
  console.log("🚀 ~ hợpĐồngVậtThểPhí:", hợpĐồngVậtThểPhí);
  console.log("🚀 ~ cácKỳPhíBịBỏ:", cácKỳPhíBịBỏ);
  await cậpNhậtCácLầnThiếtLậpPhí(entityHợpĐồng);
  await xoáCácKỳPhíBịBỏ(cácKỳPhíBịBỏ, entityHợpĐồng);
  await ghiKếHoạchĐóngPhíMới(hợpĐồngVậtThểPhí, entityHợpĐồng);
}
