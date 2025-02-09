import * as esbuild from "npm:esbuild@0.20.2";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@^0.11.1";
import * as log from "@std/log";

const entryPoints = ["./Tính toán thu nhập/Client/fibery.ts"];
// const entryPoints = ["./Tính toán thu nhập/Client/test xoá dữ liệu fibery.ts"];
const outfile = `./dist/Code chạy trên Fibery.js`;
const pushDirectory =
  "D:/Programming/Theo phần mềm/fibery-script-management/quacau.fibery.io/fibery/space/Định kỳ đóng phí/database/Hợp đồng/automations/rule/Rule ~c793.js";
const thờiĐiểmTạo = `// Tạo lúc ${Temporal.Now.plainTimeISO().toLocaleString("vi")} ngày ${Temporal.Now.plainDateISO().toLocaleString("vi")}`;

const esbuildOptions = {
  plugins: [...denoPlugins()],
  entryPoints: entryPoints,
  outfile: outfile,
  charset: "utf8",
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node12",
  treeShaking: true,
  footer: {
    js: thờiĐiểmTạo,
  },
  banner: {
    js: thờiĐiểmTạo,
  },
  supported: {
    "top-level-await": true,
  },
} satisfies esbuild.BuildOptions;
const context = await esbuild.context(esbuildOptions);
await context.watch();

// await esbuild.build(esbuildOptions);
// esbuild.stop();
await Deno.copyFile(
  outfile,
  pushDirectory,
);
console.info(thờiĐiểmTạo);
const cmd2 = new Deno.Command("pwsh", { args: ["-c", "get-content", `"${outfile}"`, "|", "set-clipboard"] });
await cmd2.output();
// log.info(`"${outfile}" đã được dựng xong và được lưu. Nó cũng đã được copy sẵn vào clipboard và sẵn sàng để dán.`);
