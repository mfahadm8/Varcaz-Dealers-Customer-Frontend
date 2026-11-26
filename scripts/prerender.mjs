// Writes static HTML for public routes after `vite build`.
// Output: dist/<route>.html, uploaded to S3 as key "<route>" with Content-Type text/html.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROUTES = {
  privacy: "Privacy Policy | Varcaz Dealers",
  terms: "Terms of Use | Varcaz Dealers",
  "data-deletion": "Delete your data | Varcaz Dealers",
};

const dist = path.resolve("dist");
const shell = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const { render } = await import(pathToFileURL(path.resolve("dist-ssr/entry-server.js")).href);

for (const [route, title] of Object.entries(ROUTES)) {
  const html = shell
    .replace("<title>Varcaz Dealers</title>", `<title>${title}</title>`)
    .replace('<div id="root"></div>', `<div id="root">${render(`/${route}`)}</div>`);
  fs.writeFileSync(path.join(dist, `${route}.html`), html);
  console.log(`prerendered /${route}`);
}
fs.rmSync(path.resolve("dist-ssr"), { recursive: true, force: true });
