import { ArgsFibery } from "../Hàm hỗ trợ/Kiểu cho Fibery.ts";
import {
  cậpNhậtCácLầnThiếtLậpPhí,
  EntityHợpĐồng,
  ghiKếHoạchĐóngPhíMới,
  lấyKếtQuảTínhToán,
  tạoHợpĐồngThiếtLậpPhí,
  xoáCácKỳPhíBịBỏ,
} from "./Hàm hỗ trợ cho Fibery.ts";

export declare const args: ArgsFibery;
export const databaseKỳPhí = "Định kỳ đóng phí/Kỳ phí";
for (const entityHợpĐồng of args.currentEntities as EntityHợpĐồng[]) {
  const hợpĐồngThiếtLậpPhí = tạoHợpĐồngThiếtLậpPhí(entityHợpĐồng);
  const { hợpĐồngVậtThểPhí, cácKỳPhíBịBỏ } = await lấyKếtQuảTínhToán(hợpĐồngThiếtLậpPhí);
  await cậpNhậtCácLầnThiếtLậpPhí(entityHợpĐồng);
  await xoáCácKỳPhíBịBỏ(cácKỳPhíBịBỏ, entityHợpĐồng);
  await ghiKếHoạchĐóngPhíMới(hợpĐồngVậtThểPhí, entityHợpĐồng);
}
