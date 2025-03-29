import { ArgsFibery } from "./Kiểu cho Fibery.ts";
import {
  cậpNhậtCácLầnThiếtLậpPhí,
  EntityHợpĐồng,
  ghiKếHoạchĐóngPhíMới,
  lấyKếtQuảTínhToán,
  tạoHợpĐồngThiếtLậpPhí,
  xoáCácKỳPhíBịBỏ,
} from "./Hàm hỗ trợ cho Fibery.ts";

declare const args: ArgsFibery;

async function main(currentEntities: EntityHợpĐồng[]) {
  for (const entityHợpĐồng of currentEntities) {
    const khôngCóChuKỳ = entityHợpĐồng["Chu kỳ"].Name === null;
    if (khôngCóChuKỳ) return;

    const hợpĐồngThiếtLậpPhí = tạoHợpĐồngThiếtLậpPhí(entityHợpĐồng);
    const { hợpĐồngVậtThểPhí, cácKỳPhíBịBỏ } = await lấyKếtQuảTínhToán(hợpĐồngThiếtLậpPhí);
    await cậpNhậtCácLầnThiếtLậpPhí(entityHợpĐồng);
    await xoáCácKỳPhíBịBỏ(cácKỳPhíBịBỏ, entityHợpĐồng);
    await ghiKếHoạchĐóngPhíMới(hợpĐồngVậtThểPhí, entityHợpĐồng);
  }
}

await main(args.currentEntities as EntityHợpĐồng[]);
