// Tính toán thu nhập/Xử lý vật thể phí.ts
function lấyKếHoạchĐóngPhíMới({ cácVậtThểPhí }) {
  const thiếtLậpPhíCuốiCùng = cácVậtThểPhí.slice(-1)[0];
  return thiếtLậpPhíCuốiCùng.kếHoạchĐóngPhí;
}

// Tính toán thu nhập/fibery.ts
var fibery = context.getService("fibery");
var http = context.getService("http");
function tạoHợpĐồngThiếtLậpPhí({
  "Các lần thiết lập phí": cácLầnThiếtLậpPhí,
  "Tổng phí": tổngPhí,
  "Chu kỳ": { Name: chuKỳ },
  "Số tiền mỗi kỳ": sốTiềnMỗiKỳ
}) {
  const dsCácDòng = cácLầnThiếtLậpPhí.trim().split("\n");
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
async function lấyHợpĐồngVậtThểPhí(hợpĐồng) {
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
  const hômNay = (/* @__PURE__ */ new Date()).toISOString().split("T")[0].trim();
  const text = cácLầnThiếtLậpPhí.trim() + `
${hômNay}: ${chuKỳ.toLocaleLowerCase()}, ${sốTiềnMỗiKỳ}`;
  await fibery.updateEntity(Type, Id, { "Các lần thiết lập phí": text });
}
async function ghiKếHoạchĐóngPhíMới(hợpĐồngVậtThểPhí) {
  const kếHoạchĐóngPhí = lấyKếHoạchĐóngPhíMới(hợpĐồngVậtThểPhí);
  const entities = kếHoạchĐóngPhí.map(({ ngàyĐóng, ngàyĐóngKếTiếp, phíĐóng, tổngSốPhíHoànThành }) => {
    return {
      Name: "",
      "Ngày đóng kế tiếp": String(ngàyĐóngKếTiếp),
      "Ngày đóng": String(ngàyĐóng),
      "Phí đóng": phíĐóng,
      "Tổng số phí hoàn thành": tổngSốPhíHoànThành
    };
  });
  const type = "Kỳ phí";
  await fibery.createEntityBatch(type, entities);
}
for (const entity of args.currentEntities) {
  const hợpĐồngThiếtLậpPhí = tạoHợpĐồngThiếtLậpPhí(entity);
  const hợpĐồngVậtThểPhí = await lấyHợpĐồngVậtThểPhí(hợpĐồngThiếtLậpPhí);
  await cậpNhậtCácLầnThiếtLậpPhí(entity);
  await ghiKếHoạchĐóngPhíMới(hợpĐồngVậtThểPhí);
}
