import * as esbuild from "npm:esbuild@0.20.2";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@^0.11.1";
import * as log from "@std/log";

const outfile = `./dist/Code chạy trên Fibery.js`;

await esbuild.build({
  plugins: [...denoPlugins()],
  entryPoints: ["./Tính toán thu nhập/Client/fibery.ts"],
  outfile: outfile,
  charset: "utf8",
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node12",
  treeShaking: true,
  // minify: true,
  footer: {
    js: `// Tạo lúc ${Temporal.Now.plainTimeISO().toLocaleString("vi")} ngày ${Temporal.Now.plainDateISO().toLocaleString("vi")}`,
  },
  supported: {
    "top-level-await": true,
  },
});

esbuild.stop();
// const cmd1 = new Deno.Command("pwsh", { args: ["-c", "$env:FIBERY_DOMAIN = 'quacau.fibery.io'"] });
// await cmd1.output();
// const cmd2 = new Deno.Command("pwsh", { args: ["-c", "$env:FIBERY_API_KEY = '26d174de.24b1cbf0079420149f218af264d06a5bf99'"] });
// await cmd2.output();
const cmd = new Deno.Command("node", {
  args: [
    "--env-file='D:/Programming/Theo phần mềm/fibery-script-management/src/.env'",
    "D:/Programming/Theo phần mềm/fibery-script-management/src/fibscripts.js",
    "push",
    "--url=https://quacau.fibery.io/fibery/space/Định_kỳ_đóng_phí/database/Hợp_đồng/automations/rule/6799ad300d3901c00626d49e/actions",
  ],
});
await cmd.output();
const cmd2 = new Deno.Command("pwsh", { args: ["-c", "get-content", `"${outfile}"`, "|", "set-clipboard"] });
await cmd2.output();
console.info(`Build time: ${Temporal.Now.plainTimeISO().toLocaleString()}`);
// log.info(`"${outfile}" đã được dựng xong và được lưu. Nó cũng đã được copy sẵn vào clipboard và sẵn sàng để dán.`);
