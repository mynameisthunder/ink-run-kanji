import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT ?? 4173);
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".wav": "audio/wav",
};

createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
  const requested = pathname === "/" ? "index.html" : pathname.slice(1);
  const filepath = join(root, requested);

  try {
    if (!filepath.startsWith(root) || !statSync(filepath).isFile()) throw new Error("Not found");
    response.writeHead(200, { "Content-Type": types[extname(filepath)] ?? "application/octet-stream" });
    createReadStream(filepath).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}).listen(port, () => {
  console.log(`INK RUN is live at http://localhost:${port}`);
});
