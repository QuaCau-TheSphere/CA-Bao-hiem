import { parseAll } from "@std/yaml";
import { parseArgs } from "@std/cli/parse-args";

interface ThiếtLập {
  Fibery: {
    Host: string;
    Token: string;
    Database: string;
    Space: string;
  };
}
export const flags = parseArgs(Deno.args, {
  string: ["host"],
  default: { host: "https://torihi.fibery.io/" },
});

const dsThiếtLập = parseAll(await Deno.readTextFile("./Thiết lập.yaml"), { schema: "core" }) as ThiếtLập[];
export const thiếtLập = dsThiếtLập.find((thiếtLập) => thiếtLập.Fibery.Host === flags.host) || dsThiếtLập[0];
