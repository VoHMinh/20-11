import http from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createGzip } from "node:zlib";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../out");
const port = Number(process.env.PORT || 3000);
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".txt": "text/plain", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".ico": "image/x-icon" };
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    let file = path.resolve(root, "." + pathname);
    if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    let info = await stat(file).catch(() => null);
    if (info?.isDirectory()) { file = path.join(file, "index.html"); info = await stat(file).catch(() => null); }
    if (!info?.isFile()) {
      file = path.join(root, "404.html");
      res.statusCode = 404;
    }
    res.setHeader("Content-Type", mime[path.extname(file)] || "application/octet-stream");
    res.setHeader("X-Content-Type-Options", "nosniff");
    const ext = path.extname(file);
    res.setHeader("Cache-Control", pathname.startsWith("/_next/static/") ? "public, max-age=31536000, immutable" : [".webp",".woff2"].includes(ext) ? "public, max-age=86400" : "no-cache");
    const gzip = /\.(html|css|js|json|txt|svg)$/.test(file) && req.headers["accept-encoding"]?.includes("gzip");
    if (gzip) { res.setHeader("Content-Encoding","gzip"); res.setHeader("Vary","Accept-Encoding"); }
    if (req.method === "HEAD") return res.end();
    const stream = createReadStream(file).on("error", () => { if (!res.headersSent) res.writeHead(404); res.end("Not found"); });
    if (gzip) stream.pipe(createGzip()).pipe(res);
    else stream.pipe(res);
  } catch { res.writeHead(400); res.end("Bad request"); }
}).listen(port, "0.0.0.0", () => console.log(`Local: http://localhost:${port}`));
