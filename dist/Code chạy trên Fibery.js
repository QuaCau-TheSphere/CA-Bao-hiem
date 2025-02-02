// Tính toán thu nhập/Xử lý vật thể phí.ts
function lấyKếHoạchĐóngPhíMới({ cácVậtThểPhí }) {
  const thiếtLậpPhíCuốiCùng = cácVậtThểPhí.slice(-1)[0];
  return thiếtLậpPhíCuốiCùng.kếHoạchĐóngPhí;
}

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
async function tínhKếHoạchĐóngPhí(hợpĐồng) {
  const res = await http.postAsync("https://nhucau.deno.dev", { body: hợpĐồng });
  return JSON.parse(res);
}
async function main() {
  for (const entity of args.currentEntities) {
    const hợpĐồngThiếtLậpPhí = tạoHợpĐồngTừEntity(entity);
    const hợpĐồngVậtThểPhí = await tínhKếHoạchĐóngPhí(hợpĐồngThiếtLậpPhí);
    const kếHoạchĐóngPhí = lấyKếHoạchĐóngPhíMới(hợpĐồngVậtThểPhí);
    console.log("🚀 ~ kếHoạchĐóngPhí:", kếHoạchĐóngPhí);
  }
}
await main();
