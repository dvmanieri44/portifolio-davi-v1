import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const dist = resolve(root, "dist");
const client = resolve(dist, "client");
const server = resolve(dist, "server");

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });

for (const path of ["index.html", "styles.css", "data.js", "img", "js/build", "js/firebase.js", "js/refactor-data.js"]) {
  await cp(resolve(root, path), resolve(client, path), { recursive: true });
}

await writeFile(
  resolve(server, "index.js"),
  `export default { async fetch(request, env) { return env.ASSETS.fetch(request); } };\n`,
  "utf8",
);
