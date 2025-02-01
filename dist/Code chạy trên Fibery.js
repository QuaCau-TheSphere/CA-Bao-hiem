// Tính toán thu nhập/fibery.ts
var fibery = context.getService("fibery");
var http = context.getService("http");
function tạoHợpĐồngTừEntity(entity) {
  const { "Các lần thiết lập phí": cácLầnThiếtLậpPhíEntity, "Tổng phí": tổngPhí, "Chu kỳ": { Name: chuKỳ, Id: idChuKỳ } } = entity;
  const cácLầnThiếtLậpPhíTrướcĐây = cácLầnThiếtLậpPhíEntity.trim().split("\n").map((dòng) => {
    const split1 = dòng.split(":");
    const split2 = split1[1].split(",");
    return {
      ngàyThiếtLập: split1[0],
      chuKỳ: split2[0].toLocaleLowerCase(),
      sốTiềnMỗiKỳ: parseInt(split2[1])
    };
  });
  return {
    tổngPhí,
    cácLầnThiếtLậpPhí: cácLầnThiếtLậpPhíTrướcĐây
  };
}
async function tínhKếHoạchĐóngPhí(hợpĐồng) {
  const res = await http.postAsync("https://nhucau.deno.dev", { body: hợpĐồng });
  return JSON.parse(res);
}
for (const entity of args.currentEntities) {
  let hợpĐồng = tạoHợpĐồngTừEntity(entity);
  console.log("🚀 ~ hợpĐồng:", hợpĐồng);
  hợpĐồng = await tínhKếHoạchĐóngPhí(hợpĐồng);
  console.log("🚀 ~ hợpĐồng:", hợpĐồng);
}
