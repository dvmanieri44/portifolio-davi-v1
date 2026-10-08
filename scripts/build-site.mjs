import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { publicAssets } from "./assets.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = resolve(root, "dist");
const client = resolve(dist, "client");
const server = resolve(dist, "server");

// Limit cleanup to this project's generated output.
if (dirname(dist) !== resolve(root)) throw new Error("Invalid build directory");
await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });

for (const path of publicAssets.keys()) {
  await mkdir(dirname(resolve(client, path)), { recursive: true });
  await copyFile(resolve(root, path), resolve(client, path));
}

await writeFile(
  resolve(server, "index.js"),
  "export default { async fetch(request, env) { return env.ASSETS.fetch(request); } };\n",
  "utf8",
);

console.log("Build concluído: dist/client (site) e dist/server (adaptador de hospedagem).");
