// 本地測試：node server.js → http://localhost:3000
const http = require('http'), fs = require('fs'), path = require('path');
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png'
};
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/addweb.html') { res.writeHead(302, { Location: '/' }); return res.end(); }
  if (/^\/antwOnline=[0-9A-Za-z]+$/.test(p)) p = '/addweb.html';   // 對應 vercel.json 的 rewrite
  if (p === '/') p = '/index.html';
  const f = path.join(__dirname, path.normalize(p));
  if (!f.startsWith(__dirname) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    res.writeHead(404); return res.end('404');
  }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(3000, () => console.log('http://localhost:3000'));
