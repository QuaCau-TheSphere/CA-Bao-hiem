import * as esbuild from "npm:esbuild@0.20.2";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@^0.11.1";
import * as log from "@std/log";

const outfile = `./dist/Code chạy trên Fibery.js`;

await esbuild.build({
  plugins: [...denoPlugins()],
  entryPoints: ["./Tính toán thu nhập/fibery.ts"],
  outfile: outfile,
  charset: "utf8",
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node15",
  treeShaking: true,
  // minify: true,
});

esbuild.stop();
const cmd = new Deno.Command("pwsh", { args: ["-c", "get-content", `"${outfile}"`, "|", "set-clipboard"] });
await cmd.output();
log.info(`"${outfile}" đã được dựng xong và được lưu. Nó cũng đã được copy sẵn vào clipboard và sẵn sàng để dán.`);
