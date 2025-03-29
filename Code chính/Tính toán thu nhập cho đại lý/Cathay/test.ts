import { HợpĐồngVậtThểPhí } from "../../Hợp đồng.ts";
import { TvvCathay } from "./Tvv.ts";

const tvv = new TvvCathay(Temporal.PlainDate.from({ year: 2025, month: 4, day: 1 }), Temporal.PlainDate.from({ year: 2025, month: 4, day: 1 }));
const sốThángLàmViệc = tvv.sốTlv(Temporal.PlainDate.from({ year: 2025, month: 5, day: 1 }));

const hợpĐồng1 = new HợpĐồngVậtThểPhí({tổngPhí: });
console.log("🚀 ~ sốThángLàmViệc:", sốThángLàmViệc);
