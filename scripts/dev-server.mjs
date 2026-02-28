import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const root = path.resolve(args.includes('--root') ? args[args.indexOf('--root') + 1] : '.');
const port = Number(args.includes('--port') ? args[args.indexOf('--port') + 1] : 5173);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json'
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  let filePath = path.join(root, urlPath === '/' ? '/index.html' : urlPath);
  if (!filePath.startsWith(root)) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(root, 'index.html');
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404).end('Not Found');
      return;
    }
    res.setHeader('Content-Type', mime[path.extname(filePath)] || 'application/octet-stream');
    res.writeHead(200).end(data);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port} (root: ${root})`);
});
