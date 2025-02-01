// Tính toán thu nhập/fibery.ts
var fibery = context.getService("fibery");
var http = context.getService("http");
function tạoHợpĐồngTừEntity(entity) {
  const {
    "Các lần thiết lập phí": cácLầnThiếtLậpPhíEntity,
    "Tổng phí": tổngPhí,
    "Chu kỳ": { Name: chuKỳ, Id: idChuKỳ },
    "Số tiền mỗi kỳ": sốTiềnMỗiKỳ
  } = entity;
  const dsCácDòng = cácLầnThiếtLậpPhíEntity.trim().split("\n");
  const cácLầnThiếtLậpPhíTrướcĐây = dsCácDòng.map((dòng) => {
    const split1 = dòng.split(":");
    const split2 = split1[1].split(",");
    return {
      ngàyThiếtLập: split1[0],
      chuKỳ: split2[0].toLocaleLowerCase(),
      sốTiềnMỗiKỳ: parseInt(split2[1])
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
async function tínhKếHoạchĐóngPhí(hợpĐồng) {
  const res = await http.postAsync("https://nhucau.deno.dev", { body: hợpĐồng });
  return JSON.parse(res);
}
var _a;
for (const entity of args.currentEntities) {
  let hợpĐồng = tạoHợpĐồngTừEntity(entity);
  console.log("🚀 ~ hợpĐồng:", hợpĐồng);
  hợpĐồng = await tínhKếHoạchĐóngPhí(hợpĐồng);
  console.log("🚀 ~ hợpĐồng.cácLầnThiếtLậpPhí:", hợpĐồng.cácLầnThiếtLậpPhí);
  const kếHoạchĐóngPhí = (_a = hợpĐồng.cácLầnThiếtLậpPhí.at(-1)) == null ? void 0 : _a.kếHoạchĐóngPhí;
  console.log("🚀 ~ kếHoạchĐóngPhí:", kếHoạchĐóngPhí);
}
